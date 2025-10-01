-- CreateTable
CREATE TABLE "public"."SyncHistory" (
    "id" SERIAL NOT NULL,
    "database_version" TEXT NOT NULL,
    "last_update" TEXT NOT NULL,
    "last_card_id" INTEGER NOT NULL,

    CONSTRAINT "SyncHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Card" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "typeline" TEXT[],
    "type" TEXT NOT NULL,
    "humanReadableCardType" TEXT NOT NULL,
    "frameType" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "race" TEXT,
    "atk" INTEGER,
    "def" INTEGER,
    "level" INTEGER,
    "attribute" TEXT,
    "archetype" TEXT,
    "ygoprodeck_url" TEXT,
    "card_images" JSONB[],
    "linkval" INTEGER,
    "linkmarkers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);
