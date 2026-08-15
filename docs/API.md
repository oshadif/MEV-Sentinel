# API Reference

## Health
`GET /api/health`

## Stats
`GET /api/stats`

## Transactions
`GET /api/transactions`

Query parameters:
- `protocol`
- `classification`
- `status`
- `address`
- `minValue`
- `search`
- `limit`

## Transaction detail
`GET /api/transactions/:hash`

## Signals
`GET /api/signals?type=WHALE&limit=100`

## Blocks
`GET /api/blocks?limit=50`

## Analytics
- `GET /api/analytics/protocols`
- `GET /api/analytics/classifications`
- `GET /api/analytics/gas`
