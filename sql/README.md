# SQL Folder Structure

```
sql/
├── bootstrap.sql                          # Database schema (run once ever)
├── reset.sql                              # Wipe ALL data and restart fresh
└── seeds/
    └── ap-physics-1/
        ├── subject.sql                    # AP Physics 1 subject row
        └── unit-1/
            ├── unit.sql                   # Unit 1: Kinematics row
            ├── lesson-01-position.sql     # ✅ Full content
            ├── lesson-02-velocity.sql     # 🔲 Stub — paste content here
            ├── lesson-03-acceleration.sql # 🔲 Stub
            ├── lesson-04-equations.sql    # 🔲 Stub
            └── lesson-05-projectile.sql   # 🔲 Stub
```

## Run order (fresh start)

Run these in Supabase SQL Editor in this exact order:

1. `reset.sql`                              ← wipes everything
2. `seeds/ap-physics-1/subject.sql`
3. `seeds/ap-physics-1/unit-1/unit.sql`
4. `seeds/ap-physics-1/unit-1/lesson-01-position.sql`
5. `seeds/ap-physics-1/unit-1/lesson-02-velocity.sql`  (once content is added)
6. ... and so on

## Adding content for a new lesson

1. Open the stub file (e.g. `lesson-02-velocity.sql`)
2. Paste your concept note between the `$note$` tags
3. Uncomment and fill the `INSERT INTO problems` section
4. Run only that file in Supabase — it's fully self-contained

## Updating a lesson

Just edit the file and re-run it in Supabase. The `ON CONFLICT ... DO UPDATE`
clause will overwrite the lesson data. Problems are deleted and reinserted
fresh every run.

## Adding a new subject or unit

Follow the same pattern:
```
sql/seeds/<subject-slug>/<unit-slug>/lesson-NN-<topic>.sql
```
Each file is self-contained — finds its parent IDs at the top using slugs.
