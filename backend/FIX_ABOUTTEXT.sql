-- ============================================
-- SCRIPT PARA CORRIGIR AboutText
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Verificar todas as colunas da tabela Profiles
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'Profiles'
ORDER BY column_name;

-- 2. Verificar dados atuais
SELECT 
    "Id",
    "Name",
    CASE 
        WHEN "AboutText" IS NULL THEN 'NULL'
        WHEN "AboutText" = '' THEN 'VAZIO'
        ELSE 'TEM DADOS: ' || LEFT("AboutText", 50)
    END as about_text_status,
    LENGTH("AboutText") as about_text_length
FROM "Profiles"
WHERE "IsDeleted" = false;

-- 3. CRIAR/VERIFICAR coluna AboutText
-- Se a coluna não existir, será criada
-- Se existir com nome errado, será renomeada
DO $$ 
BEGIN
    -- Verificar se coluna existe com nome correto (case-sensitive)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Profiles' 
        AND column_name = 'AboutText'
    ) THEN
        -- Verificar se existe com nome diferente
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'Profiles' 
            AND LOWER(column_name) = 'abouttext'
        ) THEN
            -- Renomear se existir em minúsculo
            ALTER TABLE "Profiles" RENAME COLUMN "abouttext" TO "AboutText";
            RAISE NOTICE 'Coluna renomeada de abouttext para AboutText';
        ELSE
            -- Criar nova coluna
            ALTER TABLE "Profiles" ADD COLUMN "AboutText" character varying(3000);
            RAISE NOTICE 'Coluna AboutText criada';
        END IF;
    ELSE
        RAISE NOTICE 'Coluna AboutText já existe';
    END IF;
    
    -- Garantir que o tipo está correto
    ALTER TABLE "Profiles" 
    ALTER COLUMN "AboutText" TYPE character varying(3000);
    
END $$;

-- 4. Verificar novamente após correção
SELECT 
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'Profiles' 
  AND column_name = 'AboutText';

-- 5. Mostrar dados atualizados
SELECT 
    "Id",
    "Name",
    "AboutText",
    LENGTH("AboutText") as length
FROM "Profiles"
WHERE "IsDeleted" = false;
