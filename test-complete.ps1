$ErrorActionPreference = "Continue"
Write-Host "`n=== TESTES COMPLETOS DA API DE MILHAS ===" -ForegroundColor Cyan
Write-Host ""

# ========== TESTE 1: GET Listar todas ==========
Write-Host "TEST 1: GET /api/milhas" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas" -Method Get -UseBasicParsing
    $milhas = $response.Content | ConvertFrom-Json
    Write-Host "✓ SUCESSO - Encontradas $($milhas.Count) milhas no banco" -ForegroundColor Green
    $milhas | Select-Object -First 3 | ForEach-Object { Write-Host "  - $($_.id): $($_.nomeMilha)" }
    if ($milhas.Count -gt 3) { Write-Host "  ... e mais $($milhas.Count - 3)" }
}
catch {
    Write-Host "✗ ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

# ========== TESTE 2: POST Criar ==========
Write-Host "`nTEST 2: POST /api/milhas/salvar" -ForegroundColor Yellow
try {
    $novoRegistro = @{
        nomeMilha = "Milha Terminal $(Get-Random)"
        cliente = "Cliente Teste $(Get-Date -Format 'HHmmss')"
        ip = "10.0.0.$(Get-Random -Minimum 1 -Maximum 255)"
    }
    
    $body = $novoRegistro | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/salvar" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    
    $novaMilha = $response.Content | ConvertFrom-Json
    $idCriado = $novaMilha.id
    Write-Host "✓ SUCESSO - Milha criada com ID: $idCriado" -ForegroundColor Green
    Write-Host "  Nome: $($novaMilha.nomeMilha)" -ForegroundColor Cyan
    Write-Host "  Cliente: $($novaMilha.cliente)" -ForegroundColor Cyan
    Write-Host "  IP: $($novaMilha.ip)" -ForegroundColor Cyan
}
catch {
    Write-Host "✗ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    $idCriado = $null
}

# ========== TESTE 3: GET por ID ==========
if ($idCriado) {
    Write-Host "`nTEST 3: GET /api/milhas/{id}" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/$idCriado" `
            -Method Get `
            -UseBasicParsing
        
        $milha = $response.Content | ConvertFrom-Json
        Write-Host "✓ SUCESSO - Milha encontrada" -ForegroundColor Green
        Write-Host "  ID: $($milha.id), Nome: $($milha.nomeMilha)" -ForegroundColor Cyan
    }
    catch {
        Write-Host "✗ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }

    # ========== TESTE 4: PUT Atualizar ==========
    Write-Host "`nTEST 4: PUT /api/milhas/atualizar/{id}" -ForegroundColor Yellow
    try {
        $atualizacao = @{
            nomeMilha = "Milha Atualizada $(Get-Random)"
            cliente = "Cliente Atualizado"
            ip = "172.16.0.1"
        }
        
        $body = $atualizacao | ConvertTo-Json
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/atualizar/$idCriado" `
            -Method Put `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing
        
        $milhaAtualizada = $response.Content | ConvertFrom-Json
        Write-Host "✓ SUCESSO - Milha atualizada" -ForegroundColor Green
        Write-Host "  Novo nome: $($milhaAtualizada.nomeMilha)" -ForegroundColor Cyan
        Write-Host "  Novo IP: $($milhaAtualizada.ip)" -ForegroundColor Cyan
    }
    catch {
        Write-Host "✗ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }

    # ========== TESTE 5: GET Buscar ==========
    Write-Host "`nTEST 5: GET /api/milhas/buscar/{termo}" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/buscar/Atualizada" `
            -Method Get `
            -UseBasicParsing
        
        $resultados = $response.Content | ConvertFrom-Json
        Write-Host "✓ SUCESSO - Encontradas $($resultados.Count) milhas com termo 'Atualizada'" -ForegroundColor Green
        $resultados | ForEach-Object { Write-Host "  - $($_.nomeMilha) (IP: $($_.ip))" -ForegroundColor Cyan }
    }
    catch {
        Write-Host "✗ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }

    # ========== TESTE 6: DELETE ==========
    Write-Host "`nTEST 6: DELETE /api/milhas/deletar/{id}" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/milhas/deletar/$idCriado" `
            -Method Delete `
            -UseBasicParsing
        
        $resultado = $response.Content | ConvertFrom-Json
        Write-Host "✓ SUCESSO - Milha deletada" -ForegroundColor Green
        Write-Host "  Mensagem: $($resultado.mensagem)" -ForegroundColor Cyan
    }
    catch {
        Write-Host "✗ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== TESTES FINALIZADOS ===" -ForegroundColor Cyan
Write-Host ""
