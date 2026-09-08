import { test, expect } from '@playwright/test'

test('abre João 3:16 e salva como favorito', async ({ page }) => {
  await page.goto('/biblia/joao/3/16')
  await expect(page.getByRole('heading', { name: '3' })).toBeVisible()
  await expect(page.getByText('João 3:16', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Favoritar' }).click()
  await page.getByRole('button', { name: 'Fechar ações' }).click()
  await page.goto('/favoritos')
  await expect(page.getByRole('heading', { name: 'Favoritos' })).toBeVisible()
  await expect(page.getByText('João 3:16', { exact: true })).toBeVisible()
})

test('pesquisa uma palavra e abre o resultado', async ({ page }) => {
  await page.goto('/pesquisa')
  await page.getByLabel('Pesquisar na Bíblia').fill('amor')
  await expect(page.getByRole('heading', { name: 'Resultados' })).toBeVisible({ timeout: 10_000 })
  await page.getByRole('link', { name: /amor/i }).first().click()
  await expect(page.getByText('Bíblia Livre', { exact: true }).first()).toBeVisible()
})

test('mantém uma nota depois de recarregar', async ({ page }) => {
  await page.goto('/biblia/joao/3/16')
  await page.getByRole('button', { name: 'Nota', exact: true }).click()
  await page.getByLabel('Minha nota').fill('Uma nota que deve permanecer.')
  await page.getByRole('button', { name: 'Salvar nota' }).click()
  await page.getByRole('button', { name: 'Fechar ações' }).click()
  await page.reload()
  await page.goto('/notas')
  await expect(page.getByText('Uma nota que deve permanecer.')).toBeVisible()
})

test('abre capítulos precacheados sem rede', async ({ page, context }) => {
  await page.goto('/biblia/joao/3')
  await expect(page.getByRole('heading', { name: '3' })).toBeVisible()
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    const cacheNames = await caches.keys()
    if (cacheNames.length === 0) throw new Error('Cache PWA não preparado')
  })
  await context.setOffline(true)
  await page.goto('/biblia/joao/4')
  await expect(page.getByRole('heading', { name: '4' })).toBeVisible()
})
