-- ============================================
-- Migration: Adicionar campos de Case Study ao Project
-- ============================================
-- 
-- DESCRIÇÃO:
-- Adiciona campos para estruturar projetos como case studies técnicos:
-- - BusinessProblem: Problema de negócio resolvido
-- - TechnicalSolution: Solução técnica (JSON array)
-- - TechnicalDecisions: Decisões técnicas (JSON array)
-- - TradeOffs: Trade-offs considerados (JSON array)
-- - ArchitectureNotes: Notas para snapshot visual
--
-- EXECUÇÃO:
-- Execute este script no Supabase SQL Editor ou via psql
-- ============================================

-- Adicionar coluna BusinessProblem
ALTER TABLE "Projects" 
ADD COLUMN IF NOT EXISTS "BusinessProblem" TEXT;

-- Adicionar coluna TechnicalSolution (JSON array como string)
ALTER TABLE "Projects" 
ADD COLUMN IF NOT EXISTS "TechnicalSolution" TEXT;

-- Adicionar coluna TechnicalDecisions (JSON array como string)
ALTER TABLE "Projects" 
ADD COLUMN IF NOT EXISTS "TechnicalDecisions" TEXT;

-- Adicionar coluna TradeOffs (JSON array como string)
ALTER TABLE "Projects" 
ADD COLUMN IF NOT EXISTS "TradeOffs" TEXT;

-- Adicionar coluna ArchitectureNotes
ALTER TABLE "Projects" 
ADD COLUMN IF NOT EXISTS "ArchitectureNotes" TEXT;

-- Verificar se as colunas foram criadas
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'Projects' 
    AND column_name IN ('BusinessProblem', 'TechnicalSolution', 'TechnicalDecisions', 'TradeOffs', 'ArchitectureNotes')
ORDER BY column_name;
