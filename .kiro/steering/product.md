# Rank360 – Product Overview

Rank360 is an Indian education news platform targeting students preparing for competitive exams (JEE, NEET, CUET) and navigating college admissions. The tagline is "India's Fastest Education News."

## Core Purpose
Aggregate and surface timely, student-relevant news across six categories:
- **jee** – JEE Main & Advanced, IIT/NIT/IIIT admissions, JoSAA counselling
- **neet** – NEET UG/PG, MCC counselling, medical admissions
- **cuet** – CUET UG/PG, DU/JNU/BHU admissions
- **admissions** – General counselling, seat allotment, merit lists
- **results** – Exam results, scorecards, answer keys
- **news** – General education news

## Content Pipeline
Articles are scraped from public RSS feeds (NDTV, Times of India, Hindustan Times) every 30 minutes via a Vercel Cron job. The scraper auto-detects category from keywords, generates slugs, builds structured HTML content, and inserts into PostgreSQL.

## Monetisation
Google AdSense (`NEXT_PUBLIC_ADSENSE_ID`) with ad slots placed at strategic positions (below hero, mid-page, within articles, sidebar).

## Target Audience
Indian students aged 16–24 preparing for national entrance exams. Mobile-first traffic expected.

## Production URL
https://rank360.in
