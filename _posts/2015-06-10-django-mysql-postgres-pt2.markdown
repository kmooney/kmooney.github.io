---
title: Getting out of Heroku and Migrating a Django project from PostgreSQL to MySQL Pt. 2
layout: post
date: 2015-06-10
categories: django heroku
showcomments: false
---

*This is part of a 2 part series.  [You can find the first article here.](django-mysql-postgres.html)*

In the last article, I discussed the work we would have to do to get a Web Site hosted on Heroku that used PostgreSQL migrated to a vanilla hosted environment using MySQL.  I covered the work of dumping the PostgreSQL database the "Heroku Way", loading it locally and testing the Django project locally to ensure the Heroku application would run OK.

## A Stumbling Block

I ran into a stumbling block when trying to dump the fixtures from our app.  On my final attempt, I found that the process that dumped the fixtures was consuming 7GB of resident memory.  After taking up most all the memory in my VM, either the `dumpdata` process is [OOM killed](https://www.kernel.org/doc/gorman/html/understand/understand016.html), or the host machine freezes.

A quick survey of Internet help sites indicates that I'm "using dumpdata wrong" -- [an accepted claim on stackoverflow is that dumpdata is intended to only dump small amounts of data](http://stackoverflow.com/questions/23047766/django-loaddata-out-of-memory), and is apparently designed to consume all my RAM and die when trying to dump larger amounts of data.

## Sharpening Your Yak Razor

It seemed that my options were to tweak Django's dumpdata to make it more memory efficient, write my own data export tool, or find a way to move the data directly from one DB to the other without doing any export at all.  Since the volume of data we are trying to move was at least several gigabytes, and it's best to avoid unnecessarily writing to the disk, I opted for option 3.

As it turns out, [Django has multiple database support and allows for creative database routing.](https://docs.djangoproject.com/en/1.4/topics/db/multi-db/)  I could actually do the data transfer without using a special router, so to keep things as simple and explicit, I avoided using custom routers.

The first thing I did was change my local settings file to make the just-loaded PostgreSQL database our legacy DB in Django's database settings.  Our new, empty, MySQL DB is the new 'default' DB:

    DATABASES = {
        'legacy': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'my_app',
            'USER': 'my_app',
            'PASSWORD': 'my_password',
            'HOST': 'localhost',
        },
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'my_app',
            'USER': 'my_app',
            'PASSWORD': 'my_password',
            'HOST': 'localhost',
        }
    }

Then, I created and sync'd my new database:

    mysql --user=my_user --password=my_password my_app <<< "CREATE DATABASE my_app CHARSET UTF8;" 
    python manage.py syncdb --database=mysql

Finally, all I have to do is iterate over all of our objects and save them!
[Django comes with an app called `contenttypes`](https://docs.djangoproject.com/en/1.4/ref/contrib/contenttypes/) that lets me access all objects in my system.  I can use this app to get at all of the objects I need to load from my Postgres DB and write them to my MySQL db.  

In theory, all I should have to do is load the object from the 'legacy' database, then save it, passing the `using` kwarg to the object's save() function.

In practice, I immediately get an IntegrityError from MySQL: "Cannot add or update a child row: a foreign key constraint fails"

I can work around this by temporarily disabling foreign key checks in MySQL.  The Django MySQL backend allows you to inject a bit of SQL when you start the session, using the `OPTIONS` parameter.  Options are different depending on what database engine you choose to use.  In our case, we want to update our MySQL database setting to pass the following option:

    DATABASES = {
        ... #other settings remain the same
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'my_app',
            'USER': 'my_app',
            'PASSWORD': 'my_password',
            'HOST': 'localhost',
            'OPTIONS': {'init_command': "SET FOREIGN_KEY_CHECKS=0"}
        }
    }

Obviously, this isn't something we'd keep in our settings for production use.

Now, when I loaded all of my objects, then re-saved them, it seemed that everything was working but I found that all of my many-to-many relationships were lost.  

## Getting META with it

*All of this _meta stuff is not really documented, so we are venturing deep into YMMV territory.*

To preserve my M2M relationships, I had to access the Model instances `_meta` property to figure out the following:
    1. Which fields on this model instance are M2M fields?
    2. Once I get the m2m object, what are the fields and what are those fields values?

To get the M2M fields, I did something like this:

    m2m_fields = obj._meta._many_to_many()

When I iterate over these fields, we can fetch the related objects from the legacy database:
    
    m2m_objs = getattr(obj, m2m_field.name).using('legacy').all()

Here's a gist that pulls it together:

<script src="https://gist.github.com/kmooney/70af73e2b56e5c13e5ad.js"></script>

And that's pretty much it!  After running this content loader, I restarted the server and verified that our site was working.  Now I'm ready to `mysqldump` this data to our real database!
