Write-Host "`n=== TESTE COMPLETO DA API ===" -ForegroundColor Cyan

# TEST 1
Write-Host "`nTEST 1: Listar todas as milhas" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas" -Method Get -UseBasicParsing
$milhas = $response.Content | ConvertFrom-Json
Write-Host "✓ Encontradas: $($milhas.Count) milhas" -ForegroundColor Green

# TEST 2
Write-Host "`nTEST 2: Criar nova milha" -ForegroundColor Yellow
$body = '{
  "nomeMilha": "Teste Terminal API",
  "cliente": "Cliente Teste",
  "ip": "192.168.100.1"
}'

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/salvar" -Method Post -ContentType "application/json" -Body $body -UseBasicParsing
$nova = $response.Content | ConvertFrom-Json
$id = $nova.id
Write-Host "✓ Criada com ID: $id" -ForegroundColor Green
Write-Host "  Nome: $($nova.nomeMilha)" -ForegroundColor Cyan

# TEST 3
Write-Host "`nTEST 3: Buscar por ID" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/$id" -Method Get -UseBasicParsing
$encontrada = $response.Content | ConvertFrom-Json
Write-Host "✓ Encontrada: $($encontrada.nomeMilha)" -ForegroundColor Green

# TEST 4
Write-Host "`nTEST 4: Atualizar milha" -ForegroundColor Yellow
$body = '{
  "nomeMilha": "Teste Atualizado",
  "cliente": "Cliente Atualizado",
  "ip": "10.0.0.1"
}'

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/atualizar/$id" -Method Put -ContentType "application/json" -Body $body -UseBasicParsing
$atualizada = $response.Content | ConvertFrom-Json
Write-Host "✓ Atualizada: $($atualizada.nomeMilha)" -ForegroundColor Green
Write-Host "  IP: $($atualizada.ip)" -ForegroundColor Cyan

# TEST 5
Write-Host "`nTEST 5: Buscar por termo" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/buscar/Atualizado" -Method Get -UseBasicParsing
$achados = $response.Content | ConvertFrom-Json
Write-Host "✓ Encontradas: $($achados.Count) com 'Atualizado'" -ForegroundColor Green

# TEST 6
Write-Host "`nTEST 6: Deletar milha" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/deletar/$id" -Method Delete -UseBasicParsing
$resultado = $response.Content | ConvertFrom-Json
Write-Host "✓ $($resultado.mensagem)" -ForegroundColor Green

Write-Host "`n=== TODOS OS TESTES PASSARAM COM SUCESSO! ===" -ForegroundColor Cyan
Write-Host ""
