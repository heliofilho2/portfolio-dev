-- ============================================
-- SCRIPT PARA VERIFICAR E CORRIGIR AboutText
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Verificar se a coluna existe e seu tipo
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'Profiles' 
  AND column_name LIKE '%about%' OR column_name LIKE '%About%'
ORDER BY column_name;

-- 2. Verificar dados atuais do Profile
SELECT 
    "Id",
    "Name",
    "AboutText",
    LENGTH("AboutText") as about_text_length
FROM "Profiles"
WHERE "IsDeleted" = false;

-- 3. Se a coluna não existir ou tiver nome errado, criar/corrigir
DO $$ 
BEGIN
    -- Verificar se coluna existe com nome correto (case-sensitive)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Profiles' 
        AND column_name = 'AboutText'
    ) THEN
        -- Tentar criar a coluna
        ALTER TABLE "Profiles" ADD COLUMN "AboutText" character varying(3000);
        RAISE NOTICE 'Coluna AboutText criada';
    ELSE
        RAISE NOTICE 'Coluna AboutText já existe';
    END IF;
END $$;

-- 4. Verificar novamente após correção
SELECT 
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'Profiles' 
  AND column_name = 'AboutText';
