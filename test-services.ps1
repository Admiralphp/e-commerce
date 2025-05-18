# Script de test pour vérifier le bon fonctionnement des services

Write-Host "Vérification de l'état des services après démarrage..." -ForegroundColor Cyan
Write-Host "Attendez quelques instants pour que tous les services démarrent complètement..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Test du point de terminaison de santé de l'API Gateway
Write-Host "`nTest 1: Vérification du point de terminaison de santé de l'API Gateway" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://api.phoneaccessories.local/health" -Method GET
    Write-Host "✅ API Gateway en ligne: $($response | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec de la connexion à l'API Gateway: $_" -ForegroundColor Red
}

# Test du service d'authentification - Enregistrement d'un utilisateur
Write-Host "`nTest 2: Enregistrement d'un utilisateur de test" -ForegroundColor Cyan
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "Test123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://api.phoneaccessories.local/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Utilisateur enregistré avec succès: $($response | ConvertTo-Json)" -ForegroundColor Green
    $token = $response.token
} catch {
    Write-Host "❌ Échec de l'enregistrement de l'utilisateur: $_" -ForegroundColor Red
}

# Test du service de produits - Récupération des produits
Write-Host "`nTest 3: Récupération de la liste des produits" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://api.phoneaccessories.local/api/products" -Method GET
    Write-Host "✅ Produits récupérés avec succès. Nombre de produits: $($response.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec de la récupération des produits: $_" -ForegroundColor Red
}

# Test du service de commandes - Ajout d'un produit au panier (nécessite authentification)
if ($token) {
    Write-Host "`nTest 4: Ajout d'un produit au panier" -ForegroundColor Cyan
    $body = @{
        productId = "1"
        name = "iPhone Case"
        price = 19.99
        quantity = 2
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://api.phoneaccessories.local/api/cart" -Method POST -Body $body -ContentType "application/json" -Headers @{Authorization = "Bearer $token"}
        Write-Host "✅ Produit ajouté au panier avec succès: $($response | ConvertTo-Json)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Échec de l'ajout au panier: $_" -ForegroundColor Red
    }

    # Test de récupération du panier
    Write-Host "`nTest 5: Récupération du panier" -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod -Uri "http://api.phoneaccessories.local/api/cart" -Method GET -Headers @{Authorization = "Bearer $token"}
        Write-Host "✅ Panier récupéré avec succès: $($response | ConvertTo-Json)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Échec de la récupération du panier: $_" -ForegroundColor Red
    }
}

Write-Host "`nTests terminés. Vérifiez les résultats ci-dessus pour vous assurer que tous les services fonctionnent correctement." -ForegroundColor Cyan
Write-Host "Vous pouvez maintenant accéder aux interfaces utilisateur:" -ForegroundColor Yellow
Write-Host "- Frontend Client: http://localhost:3001" -ForegroundColor Yellow
Write-Host "- Admin Dashboard: http://localhost:4200" -ForegroundColor Yellow
