# Teste de APIs

Write-Host "=== Teste da API de Milhas ===" -ForegroundColor Cyan
Write-Host ""

# 1. Listar todas as milhas
Write-Host "1. GET /api/milhas - Listar todas as milhas" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas" -Method Get -ContentType "application/json" -UseBasicParsing
    $milhas = $response.Content | ConvertFrom-Json
    Write-Host "✓ Sucesso! Encontradas $($milhas.Count) milhas" -ForegroundColor Green
    $milhas | ForEach-Object { Write-Host "  - $($_.nomeMilha) (Cliente: $($_.cliente), IP: $($_.ip))" }
} catch {
    Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 2. Buscar por termo
Write-Host "2. GET /api/milhas/buscar/{termo} - Buscar milhas" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/buscar/NOVA" -Method Get -ContentType "application/json" -UseBasicParsing
    $resultado = $response.Content | ConvertFrom-Json
    Write-Host "✓ Sucesso! Encontradas $($resultado.Count) milhas com termo 'NOVA'" -ForegroundColor Green
    $resultado | ForEach-Object { Write-Host "  - $($_.nomeMilha)" }
} catch {
    Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 3. Criar nova milha (POST)
Write-Host "3. POST /api/milhas/salvar - Criar nova milha" -ForegroundColor Yellow
try {
    $body = @{
        nomeMilha = "Teste API $(Get-Date -Format 'HHmmss')"
        cliente = "Cliente Teste"
        ip = "192.168.1.100"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/salvar" -Method Post -ContentType "application/json" -Body $body -UseBasicParsing
    $novaMilha = $response.Content | ConvertFrom-Json
    Write-Host "✓ Milha criada com sucesso! ID: $($novaMilha.id)" -ForegroundColor Green
    Write-Host "  Nome: $($novaMilha.nomeMilha), Cliente: $($novaMilha.cliente), IP: $($novaMilha.ip)"
    $idMilha = $novaMilha.id
} catch {
    Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 4. Buscar por ID
if ($idMilha) {
    Write-Host "4. GET /api/milhas/{id} - Buscar por ID" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/$idMilha" -Method Get -ContentType "application/json" -UseBasicParsing
        $milha = $response.Content | ConvertFrom-Json
        Write-Host "✓ Sucesso! Encontrada milha ID $idMilha" -ForegroundColor Green
        Write-Host "  Nome: $($milha.nomeMilha), Cliente: $($milha.cliente), IP: $($milha.ip)"
    }
    catch {
        Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host ""

    # 5. Atualizar milha (PUT)
    Write-Host "5. PUT /api/milhas/atualizar/{id} - Atualizar milha" -ForegroundColor Yellow
    try {
        $body = @{
            nomeMilha = "Teste API ATUALIZADO $(Get-Date -Format 'HHmmss')"
            cliente = "Cliente Atualizado"
            ip = "192.168.1.200"
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/atualizar/$idMilha" -Method Put -ContentType "application/json" -Body $body -UseBasicParsing
        $milhaAtualizada = $response.Content | ConvertFrom-Json
        Write-Host "✓ Milha atualizada com sucesso!" -ForegroundColor Green
        Write-Host "  Nome: $($milhaAtualizada.nomeMilha), Cliente: $($milhaAtualizada.cliente), IP: $($milhaAtualizada.ip)"
    }
    catch {
        Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host ""

    # 6. Deletar milha (DELETE)
    Write-Host "6. DELETE /api/milhas/deletar/{id} - Deletar milha" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/deletar/$idMilha" -Method Delete -ContentType "application/json" -UseBasicParsing
        $resultado = $response.Content | ConvertFrom-Json
        Write-Host "✓ Milha deletada com sucesso!" -ForegroundColor Green
        Write-Host "  Mensagem: $($resultado.mensagem)"
    }
    catch {
        Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Testes concluídos ===" -ForegroundColor Cyan
