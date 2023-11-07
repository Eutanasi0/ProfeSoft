CREATE TABLE "comments"(
    "id" SERIAL NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL,
    "user_id" INTEGER NOT NULL,
    "profesor_id" INTEGER NOT NULL
);
ALTER TABLE
    "comments" ADD PRIMARY KEY("id");
CREATE TABLE "teachers_courses"(
    "profesor_id" INTEGER NOT NULL,
    "cursos_id" INTEGER NOT NULL
);
CREATE TABLE "users"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "hashed_pass" VARCHAR(255) NOT NULL,
    "salt" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
CREATE TABLE "courses"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "courses" ADD PRIMARY KEY("id");
CREATE TABLE "teachers"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL
);
ALTER TABLE
    "teachers" ADD PRIMARY KEY("id");
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_profesor_id_foreign" FOREIGN KEY("profesor_id") REFERENCES "teachers"("id");
ALTER TABLE
    "teachers_courses" ADD CONSTRAINT "teachers_courses_profesor_id_foreign" FOREIGN KEY("profesor_id") REFERENCES "teachers"("id");
ALTER TABLE
    "teachers_courses" ADD CONSTRAINT "teachers_courses_cursos_id_foreign" FOREIGN KEY("cursos_id") REFERENCES "courses"("id");
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");