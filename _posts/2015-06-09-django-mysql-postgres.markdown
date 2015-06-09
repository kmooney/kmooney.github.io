---
title: Getting out of Heroku and Migrating a Django project from PostgreSQL to MySQL
layout: post
date: 2015-06-09
categories: django, heroku
showcomments: false
---

While examining our hosting costs, I discovered that we were hosting one customer on Heroku and it cost us more than $900.00/mo.  The customer we were hosting was a medium-sized CMS site and we had a (relatively) twelve-factor compatible internal hosting environment that the site could be deployed to.  You can read about twelve-factor [here](http://12factor.net/).

It turned out that the site would be easy to migrate to our production cluster, except for one small thing - our default database is MySQL and this very expensive CMS site was running in PostgreSQL.

I now had the unenviable task of migrating a site from PostgreSQL to MySQL.  It turns out that there were plenty of tutorials on going the other direction (from MySQL to the much more capable PostgreSQL), but none that were specific to Migrating a site off of Heroku.  

[This blog post](https://www.calazan.com/migrating-django-app-from-mysql-to-postgresql/) provided an excellent framework and starting point, though the specifics of my task were a bit more complicated.

## The Migration

To actually migrate our customer's whole site, we had to get a copy of their postgres database, load the database locally, export all the fixtures as JSON, reload all the fixtures locally into a MySQL database, export the MySQL database, and finally re-import the MySQL compatible dump into our production cluster.  

It would be concievable to spin up a PostgreSQL database in production, but our goal was to reduce hosting costs so it was better to use the infrastructure we had rather than to add even more boxes and arrows to the chart.

### Your First Dump

So the first thing we have to do is get a copy of our database out of heroku.  [This post from Heroku](https://devcenter.heroku.com/articles/heroku-postgres-import-export) describes the step-by-step requirements.


First, capture the backup of the site:
    heroku pg:backups capture --app=my-app
    curl -o my-app.dump `heroku pg:backups public-url --app=my-app`

Now you have a copy of the PostgreSQL DB on your local system.  Next, make sure you have both PostgreSQL and MySQL installed locally. (In Ubuntu or another debian-like): 

    apt-get install postgresql postgresql-config -y

You'll need to make sure that you have a database into which your dump will go.  Postgres has create database commands, or you can do it from the command line interface:

    CREATE DATABASE myapp LC_CTYPE="C" LC_COLLATE="C" ENCODING="UTF8" TEMPLATE=template0;

Once it is installed and running, import your database using the instructions from Heroku's instructions:

    pg_restore --verbose --clean --no-acl --no-owner -h localhost -U myuser -d mydb my-app.dump

### Starting the application locally

Now you have a copy of your heroku application's database!  In order to get a proper JSON dump of the fixtures, you will now need to get a copy of the application:

   git@heroku.com:my-app-slug.git 
   cd my-app-slug

If you have virtualenv installed, you should create a virtual environment for the app now, then install the requirements.

    virtualenv .
    . bin/activate
    pip install -r requirements.txt

Once your requirements are installed, you should have a working local development site!  Try and run the server to see what happens.  If you aren't sure which settings file to use, you can check the Procfile which should be in the `my-app-slug` directory.

    python manage.py runserver 0:8000 --settings=my-app-settings

You can also put your settings into the `DJANGO_SETTINGS_MODULE` environment variable.  It's a good idea - otherwise you'll be typing the module name a lot.

### Your Second Dump

Finally, you can dump your data as a django fixture:
   
    python manage.py dumpdata --settings=my-app-settings > my_app_data.json

This may take a while to cook, depending on how much data you've got.  Once it is done, you will change you database settings to mysql, and load the data back up.

    python manage.py loaddata --settings=my-app-settings-mysql my_app_data.json

### Your Third Dump

Once the data is loaded into MySQL, you can dump that as a mysqldump file, ready for deployment to your production cluster.

    mysqldump my_app > my_app.mysql.dump


