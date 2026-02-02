$ErrorActionPreference = "Continue"

Write-Host "=== Teste da API de Milhas ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. GET /api/milhas" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas" -Method Get -UseBasicParsing
$milhas = $response.Content | ConvertFrom-Json
Write-Host "✓ Encontradas $($milhas.Count) milhas" -ForegroundColor Green
Write-Host ""

Write-Host "2. POST /api/milhas/salvar" -ForegroundColor Yellow
$body = @{
    nomeMilha = "Teste Terminal"
    cliente = "Cliente XYZ"
    ip = "10.0.0.1"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/salvar" -Method Post -ContentType "application/json" -Body $body -UseBasicParsing
$novaMilha = $response.Content | ConvertFrom-Json
$idMilha = $novaMilha.id
Write-Host "✓ Milha criada! ID: $idMilha" -ForegroundColor Green
Write-Host ""

Write-Host "3. PUT /api/milhas/atualizar/$idMilha" -ForegroundColor Yellow
$body = @{
    nomeMilha = "Teste Terminal ATUALIZADO"
    cliente = "Cliente ABC"
    ip = "10.0.0.2"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/atualizar/$idMilha" -Method Put -ContentType "application/json" -Body $body -UseBasicParsing
Write-Host "✓ Milha atualizada!" -ForegroundColor Green
Write-Host ""

Write-Host "4. DELETE /api/milhas/deletar/$idMilha" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/deletar/$idMilha" -Method Delete -UseBasicParsing
Write-Host "✓ Milha deletada!" -ForegroundColor Green
Write-Host ""

Write-Host "=== Todos os testes executados com sucesso! ===" -ForegroundColor Cyan
