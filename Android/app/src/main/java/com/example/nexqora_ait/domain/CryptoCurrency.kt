package com.example.nexqora_ait.domain

import com.example.nexqora_ait.data.CryptoCurrencyModel

data class CryptoCurrency(
    val id: String,
    val symbol: String,
    val name: String,
    val image: String,
    val current_price: Double?,
    val market_cap: Double?,
    val market_cap_rank: Int?,
    val fully_diluted_valuation: Double?,
    val total_volume: Double?,
    val high_24h: Double?,
    val low_24h: Double?,
    val price_change_24h: Double?,
    val price_change_percentage_24h: Double?,
    val market_cap_change_24h: Double?,
    val market_cap_change_percentage_24h: Double?,
    val circulating_supply: Double?,
    val total_supply: Double?,
    val max_supply: Double?,
    val ath: Double?,
    val ath_change_percentage: Double?,
    val ath_date: String?,
    val atl: Double?,
    val atl_change_percentage: Double?,
    val atl_date: String?,
    val last_updated: String?
)

fun CryptoCurrencyModel.toCryptoCurrency(): CryptoCurrency {
    return CryptoCurrency(
        id,
        symbol,
        name,
        image,
        current_price,
        market_cap,
        market_cap_rank,
        fully_diluted_valuation,
        total_volume,
        high_24h,
        low_24h,
        price_change_24h,
        price_change_percentage_24h,
        market_cap_change_24h,
        market_cap_change_percentage_24h,
        circulating_supply,
        total_supply,
        max_supply,
        ath,
        ath_change_percentage,
        ath_date,
        atl,
        atl_change_percentage,
        atl_date,
        last_updated
    )
}
