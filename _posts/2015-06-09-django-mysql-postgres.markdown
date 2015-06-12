---
title: Getting out of Heroku and Migrating a Django project from PostgreSQL to MySQL Pt. 1
layout: post
date: 2015-06-09
categories: django heroku
showcomments: false
---

While examining our hosting costs, I discovered that we were hosting one customer on Heroku and it cost us a lot of money.  The customer we were hosting was a medium-sized CMS site and we had a (relatively) twelve-factor compatible internal hosting environment that the site could be deployed to.  You can read about twelve-factor [here](http://12factor.net/).

It turned out that the site would be easy to migrate to our production cluster, except for one small thing - our default database is MySQL and this expensive to host CMS site was running in PostgreSQL.

I now had the unenviable task of migrating a site from PostgreSQL to MySQL.  It turns out that there were plenty of tutorials for going the other direction (from MySQL to the much more capable PostgreSQL), but none that were specific to getting a site away from Heroku.

[This blog post](https://www.calazan.com/migrating-django-app-from-mysql-to-postgresql/) provided an excellent framework and starting point, though the specifics of my task were a bit more complicated.

## The Migration

To actually migrate our customer's whole site, we had to get a copy of their postgres database, load the database locally, export all the fixtures as JSON, reload all the fixtures locally into a MySQL database, export the MySQL database, and finally re-import the MySQL compatible dump into our production cluster.  

It would be concievable to spin up a PostgreSQL database in production, but our goal was to reduce hosting costs so it was better to use the infrastructure we had rather than to add even more boxes and arrows to the chart.

### My First Dump

So the first thing I had to do was get a copy of our database out of heroku.  [This post from Heroku describes how to do that, step-by-step.](https://devcenter.heroku.com/articles/heroku-postgres-import-export)


First, I captured the backup of the site:
    heroku pg:backups capture --app=my-app
    curl -o my-app.dump `heroku pg:backups public-url --app=my-app`

Now I had a copy of the PostgreSQL DB on my local system.  Next, I made sure I had both PostgreSQL and MySQL installed locally.

After that, I had to make sure there was a place for my default database to go.  Postgres has create database commands, but I could create it from `psql`:

    CREATE DATABASE myapp LC_CTYPE="C" LC_COLLATE="C" ENCODING="UTF8" TEMPLATE=template0;

Once I had a PostgreSQL database up and running, I restored the dump from Heroku into my local environment:

    pg_restore --verbose --clean --no-acl --no-owner -h localhost -U myuser -d mydb my-app.dump

### Starting the application locally

Finally, I had a copy of my Heroku application's database!  In order to get a proper JSON dump of the fixtures, I needed to get a copy of the application.

   git@heroku.com:my-app-slug.git 
   cd my-app-slug

I had a virtual environment installed, so I installed the requirements there.

    virtualenv .
    . bin/activate
    pip install -r requirements.txt

With my requirements installed, I had a working development site!  I was able to run the django project and with some minor tweaks to the settings file, verify that everything was working.

    python manage.py runserver 0:8000 --settings=my-app-settings

(I put my settings into the `DJANGO_SETTINGS_MODULE` environment variable.  It's a good idea - cuts down on the typing.)

### My Second Dump

Next, I tried to dump everything as a fixture, with the intention of running loaddata on the dump and re-importing to MySQL.
   
    python manage.py dumpdata --settings=my-app-settings > my_app_data.json

The problem was that I kept running out of memory!  I increased the memory in my VM and eventually crashed my host machine.  I could see that naively running `dumpdata` was not going to work.  

*I will discuss how to get around this limitation in Part II, tomorrow*

