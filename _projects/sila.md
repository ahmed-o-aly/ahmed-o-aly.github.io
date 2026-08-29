---
layout: page
title: Sila
permalink: /projects/sila/
description: A medical field-sales platform I founded and built for teams working across the UAE.
importance: -2
category: current venture
venture: true
artifacts:
  - label: Visit Sila
    url: https://almanarsystems.com/
  - label: See the platform
    url: https://almanarsystems.com/features
---

I started Sila after seeing how much of medical field sales still moves through spreadsheets, WhatsApp messages, and end-of-week calls. The work happens in hospitals and clinics, but managers often have to reconstruct it later. I founded Al Manar Systems to build a better record of that work.

Sila has two sides. Managers use a web dashboard to plan territories and schedules, keep track of accounts and contacts, and see what is happening in the field. Representatives use a mobile app to begin a shift, follow the day's visits, check in at a facility, record who they met, and create an invoice before leaving.

A large part of the project was the map. I assembled and classified more than 4,500 healthcare facilities across the UAE, then connected them to accounts, schedules, visits, and territory coverage. It lets a manager see where the team has been, which areas are being missed, and which facilities are nearby when planning the next visit.

I did not want to give the team another place to enter data. I wanted the record to come out of the work itself. During an active shift, the app can record route points and GPS-verified check-ins. A visit, its timestamp, the contact met, and the resulting invoice stay connected. The app is also designed to keep the basic field workflow usable when connectivity is poor and synchronize later.

I built the manager portal in Next.js, the mobile app in Flutter, and the multi-tenant backend in Supabase with Postgres and PostGIS. Each company has its own workspace, and its data stays within that organization.

The web platform is live at [almanarsystems.com](https://almanarsystems.com/). The Android build has been tested on a physical device, while the public Play Store release is still in progress.
