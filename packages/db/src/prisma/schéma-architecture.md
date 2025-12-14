Super boulot — tu as bien organisé le schéma et ajouté proprement le pivot `ClassTeacher`. J’ai relu tout ton `schema.prisma` et je propose **quelques corrections et nettoyages** pour éviter des relations ambigües, améliorer la cohérence et assurer la compatibilité avec NextAuth + ton domaine métier.

Je fournis :

1. **Un `schema.prisma` corrigé** (prêt à `prisma migrate`), avec commentaires.
2. **Explications claires** pour chaque modification (pourquoi et conséquences).
3. **Exemples Prisma** courts (comment lier un prof à une classe, créer une matière, créer le pivot classe–matière, créer un examen, ajouter une note).
4. **Étapes de migration / précautions**.

---

## 1) Points principaux à corriger / remarques rapides

- Tu as **à la fois** une table pivot `ClassSubjects` (bien) **et** des champs `classes   Class[] @relation("ClassSubjects")` **et** `subject Subject? @relation("ClassSubjects", fields: [subjectId], ...)` dans `Class`.
  → Ça crée une ambigüité : soit tu utilises la pivot table explicitement (recommandé), soit la relation many-to-many implicite. Il faut choisir **la pivot explicite** et **supprimer** le champ `subject` dans `Class` et la relation `classes Class[]` dans `Subject`.
- `Student.classId` était obligatoire (sans `?`) ; souvent on veut qu’il soit **optionnel** (élève non affecté encore). Je le rends optionnel.
- Harmonisation : garder **les arrays de pivot** (`classSubjects` / `ClassSubjects[]`) sur les deux côtés, et **supprimer** les relations implicites.
- Vérifier `onDelete: Cascade` où nécessaire — tu as bien utilisé dans plusieurs relations ; j’ai conservé/limité aux relations tenant-critical.
- `Account`, `VerificationToken`, `Session` : ok pour NextAuth (noms attendus).
- `Profile.Student` était `Student[]` : ok — un profil peut être lié à plusieurs Student (ex : un compte qui représente plusieurs élèves ?). OK si voulu.

---

## 2) Schema corrigé (coller dans `schema.prisma` — remplace les sections correspondantes)

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ENUMS
enum SchoolRole {
  ADMIN
  TEACHER
  STUDENT
  PARENT
}

enum GlobalRole {
  SUPER_ADMIN
  USER
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}

/*** MODELS ***/

model User {
  id            String      @id @default(cuid())
  email         String      @unique
  password      String
  globalRole    GlobalRole?

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  deletedAt     DateTime?
  emailVerified DateTime?

  profile     Profile?
  memberships SchoolUser[]
  sessions    Session[]
  Account     Account[]

  @@index([email])
}

model Profile {
  id String @id @default(cuid())

  firstname String
  lastname  String
  phone     String?
  photo     String?
  gender    Gender?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user          User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId        String  @unique

  ParentStudent ParentStudent[]
  Student       Student[]   // si un profil peut représenter plusieurs enregistrements d'élève (optionnel)
}

model School {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  address   String
  code      String?   @unique
  planId    String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  classes       Class[]
  students      Student[]
  memberships   SchoolUser[]
  subscriptions Subscription[]
  Subject       Subject[]
}

/* pivot User <-> School */
model SchoolUser {
  id String @id @default(cuid())

  school   School @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  schoolId String

  user     User   @relation(fields: [userId], references: [id])
  userId   String

  role      SchoolRole
  isOwner   Boolean   @default(false)
  createdAt DateTime  @default(now())

  subject       Subject[]       // matières dont il est responsable (optionnel)
  ClassTeacher   ClassTeacher[]  // pivot prof <-> classe (s'il enseigne plusieurs classes)
  Class          Class[]         // s'il est chef de classe (teacherId sur Class)

  @@unique([schoolId, userId])
  @@index([schoolId])
  @@index([userId])
  @@index([role])
}

/* Subject: utilise pivot ClassSubjects (explicit) */
model Subject {
  id        String     @id @default(cuid())
  name      String
  code      String?
  school    School     @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  schoolId  String
  teacher   SchoolUser? @relation(fields: [teacherId], references: [id])
  teacherId String?

  // pivot explicit many-to-many
  ClassSubjects ClassSubjects[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  Exam      Exam[]

  @@unique([code, schoolId])
  @@index([schoolId])
}

/* Pivot explicit pour Class <-> Subject */
model ClassSubjects {
  id        String  @id @default(cuid())
  class     Class   @relation(fields: [classId], references: [id], onDelete: Cascade)
  classId   String
  subject   Subject @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  subjectId String

  @@unique([classId, subjectId])
  @@index([classId])
  @@index([subjectId])
}

model Exam {
  id        String   @id @default(cuid())
  title     String
  startDate DateTime
  endDate   DateTime
  class     Class    @relation(fields: [classId], references: [id])
  classId   String
  subject   Subject  @relation(fields: [subjectId], references: [id])
  subjectId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  Result    Result[]

  @@index([classId])
  @@index([subjectId])
}

model Result {
  id        String   @id @default(cuid())
  student   Student  @relation(fields: [studentId], references: [id])
  studentId String
  exam      Exam     @relation(fields: [examId], references: [id])
  examId    String
  score     Float
  createdAt DateTime @default(now())

  @@unique([studentId, examId])
}

model Class {
  id        String   @id @default(cuid())
  name      String
  level     String
  section   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  school   School @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  schoolId String

  // chef de classe (optionnel) - SchoolUser relation
  teacher   SchoolUser? @relation(fields: [teacherId], references: [id])
  teacherId String?

  students Student[]
  exam     Exam[]

  // pivot explicit many-to-many
  classSubjects ClassSubjects[]
  ClassTeacher  ClassTeacher[]

  @@index([schoolId])
}

/* Pivot Prof <-> Classe (nouveau) */
model ClassTeacher {
  id        String     @id @default(cuid())
  class     Class      @relation(fields: [classId], references: [id], onDelete: Cascade)
  classId   String
  teacher   SchoolUser @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  teacherId String

  createdAt DateTime @default(now())

  @@unique([classId, teacherId])
  @@index([classId])
  @@index([teacherId])
}

/* Etudiant */
model Student {
  id             String   @id @default(cuid())
  profile        Profile  @relation(fields: [profileId], references: [id])
  profileId      String
  matricule      String
  enrollmentYear String
  birthDate      DateTime

  school   School @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  schoolId String

  // classId optionnel (un élève peut ne pas être encore affecté)
  classId     String?
  schoolClass Class?  @relation(fields: [classId], references: [id])

  attendances Attendance[]
  Result      Result[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
  ParentStudent ParentStudent[]

  @@unique([matricule, schoolId])
  @@index([schoolId])
}

/* Parent - Student pivot */
model ParentStudent {
  id              String   @id @default(cuid())
  parentProfile   Profile  @relation(fields: [parentProfileId], references: [id])
  parentProfileId String
  student         Student  @relation(fields: [studentId], references: [id])
  studentId       String
  relationType    String?
  createdAt       DateTime @default(now())

  @@unique([parentProfileId, studentId])
}

/* Invite */
model Invite {
  id        String     @id @default(cuid())
  email     String
  schoolId  String
  studentId String?
  token     String     @unique
  relation  String?
  createdAt DateTime   @default(now())
  expiresAt DateTime
  used      Boolean    @default(false)
  role      SchoolRole

  @@index([schoolId])
  @@index([studentId])
}

/* Attendance */
model Attendance {
  id        String           @id @default(cuid())
  student   Student          @relation(fields: [studentId], references: [id])
  studentId String
  date      DateTime
  status    AttendanceStatus

  createdAt DateTime @default(now())

  @@unique([studentId, date])
  @@index([studentId, date])
}

/* Billing */
model Plan {
  id           String         @id @default(cuid())
  name         String
  stripeId     String?
  priceCents   Int
  features     String?
  createdAt    DateTime       @default(now())
  subscription Subscription[]
}

model Subscription {
  id          String    @id @default(cuid())
  school      School    @relation(fields: [schoolId], references: [id])
  schoolId    String
  plan        Plan      @relation(fields: [planId], references: [id])
  planId      String
  stripeSubId String?
  status      String
  startedAt   DateTime  @default(now())
  endedAt     DateTime?
  createdAt   DateTime  @default(now())

  @@index([schoolId])
}

/*** NextAuth required models ***/
model Account {
  id                String  @id @default(cuid())
  user              User    @relation(fields: [userId], references: [id])
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  createdAt  DateTime @default(now())

  @@unique([identifier, token])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  user         User     @relation(fields: [userId], references: [id])
  userId       String
  expires      DateTime
  createdAt    DateTime @default(now())

  @@index([userId])
}
```

---

## 3) Explications des changements (linéaire et pourquoi)

1. **Pivot ClassSubjects & suppression des relations implicites**

   - Avant : tu avais `Subject.classes` et `Class.subject` en plus du pivot `ClassSubjects`.
   - Maintenant : **seulement le pivot `ClassSubjects`** est utilisé pour le many-to-many `Class <-> Subject`.
   - **Pourquoi** : évite ambiguité, facilite requêtes explicites (`prisma.classSubjects.create`), et rend les contraintes uniques (`@@unique([classId, subjectId])`) évidentes.

2. **Class.subjectId supprimé**

   - Un champ `subjectId` dans `Class` (plus un `Subject[]`) forçait un lien one-to-many. On a besoin d’un many-to-many, donc supprimé.

3. **ClassTeacher pivot**

   - Ta pivot `ClassTeacher` est parfaite : permet à un prof d’enseigner plusieurs classes et à une classe d’avoir plusieurs profs (ex : co-enseignement).
   - `@@unique([classId, teacherId])` évite duplication.

4. **Student.classId rendu optionnel**

   - Un élève peut être temporairement sans classe ; rendre `classId` optionnel évite la contrainte.

5. **OnDelete cascade**

   - J’ai conservé `onDelete: Cascade` sur les relations tenant-critical (`School` → `Class`, `Subject`, `Student`) pour que la suppression d’une école supprime ses objets enfants ; attention en production : fais backup avant suppression.

6. **Indexes / uniques**

   - Maintenus ou ajoutés pour performances (search by schoolId, etc.) et cohérence (`@@unique([matricule, schoolId])`, `@@unique([code, schoolId])`).

7. **NextAuth models**

   - `Account`, `Session`, `VerificationToken` conformes au `@auth/prisma-adapter` (noms & champs requis).

---

## 4) Exemples Prisma (usage courant)

### a) Lier un prof (`SchoolUser`) à une classe (créer pivot `ClassTeacher`)

```ts
await prisma.classTeacher.create({
  data: {
    class: { connect: { id: classId } },
    teacher: { connect: { id: schoolUserId } },
  },
});
```

### b) Créer une matière et la lier à une école + teacher (optionnel)

```ts
await prisma.subject.create({
  data: {
    name: "Mathématiques",
    code: "MATH101",
    school: { connect: { id: schoolId } },
    teacher: { connect: { id: schoolUserId } }, // schoolUserId doit être un SchoolUser (role TEACHER)
  },
});
```

### c) Lier une matière à une classe (pivot ClassSubjects)

```ts
await prisma.classSubjects.create({
  data: {
    class: { connect: { id: classId } },
    subject: { connect: { id: subjectId } },
  },
});
```

### d) Créer un examen

```ts
await prisma.exam.create({
  data: {
    title: "Contrôle 1",
    startDate: new Date("2025-11-10T09:00:00Z"),
    endDate: new Date("2025-11-10T10:00:00Z"),
    class: { connect: { id: classId } },
    subject: { connect: { id: subjectId } },
  },
});
```

### e) Enregistrer / upserter une note

```ts
await prisma.result.upsert({
  where: { studentId_examId: { studentId, examId } },
  update: { score },
  create: {
    student: { connect: { id: studentId } },
    exam: { connect: { id: examId } },
    score,
  },
});
```

---

## 5) Migration & précautions

1. **Backup** de la base avant de modifier le `schema.prisma`.
2. Modifier `schema.prisma` (coller la version corrigée).
3. `npx prisma generate` puis `npx prisma migrate dev --name restructure-class-subjects` (en dev).
4. Si tu as données existantes :

   - il faudra **migrer les anciennes relations** : par ex. si tu as `Class.subjectId` rempli, tu dois convertir ces valeurs en lignes `ClassSubjects` (script Node qui lit tous les `Class` avec `subjectId` et crée les pivots correspondants).
   - idem si `Student.classId` était obligatoire et tu rends optionnel : vérifier les contraintes existantes.

5. Tester les queries (create/read/update/delete) localement.

---

## 6) Vérifications pratiques / recommandations

- Vérifie que **SchoolUser** est bien utilisé pour les autorisations (vérifier membership avant operations).
- Pour les cas où un `SchoolUser` est référencé comme `teacher` (Subject.teacher), assure-toi que `role === TEACHER` (en logique appli).
- Si tu veux historiser les affectations (quand un prof a enseigné la classe), ajoute éventuellement `startDate` / `endDate` à `ClassTeacher`.
- Si tu veux éviter cascade delete destructive en prod, préfère **soft-delete** (`deletedAt`) sur School au lieu de cascade physiquement (ou fais cascade + backups).

---

Si tu veux maintenant je peux :

- A) te fournir **le script de migration Node** (small) qui : lit `Class.subjectId` et crée `ClassSubjects` correspondants, puis supprime `subjectId` si nécessaire ;
- B) générer **exemples complets de routes Express** (createSubject, linkClassToSubject, createExam, upsertResult, linkTeacherToClass) basées sur ce schéma corrigé ;
- C) appliquer une vérification facultative : snippet qui empêche qu’un `SchoolUser` non-TEACHER soit connecté comme `teacher` d’une `Subject`.

Dis-moi lequel tu veux en premier et je te le fournis avec explications pas-à-pas.
