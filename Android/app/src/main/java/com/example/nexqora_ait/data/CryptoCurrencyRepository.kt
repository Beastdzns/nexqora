package com.example.nexqora_ait.data

import com.example.nexqora_ait.domain.CryptoCurrency
import com.example.nexqora_ait.domain.toCryptoCurrency
import com.example.nexqora_ait.util.error_handlers.NetworkError
import io.ktor.client.*
import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.util.network.UnresolvedAddressException
import kotlinx.serialization.SerializationException
import com.example.nexqora_ait.util.error_handlers.Result

class CryptoCurrencyRepository(private val client: HttpClient) {

    suspend fun getCryptoCurrencies(
        perPage: Int = 50,
        page: Int = 1
    ): Result<List<CryptoCurrency>, NetworkError> {
        val response = try {
            client.get(
                urlString = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=$perPage&page=$page&sparkline=false"
            )
        } catch (e: UnresolvedAddressException) {
            return Result.Error(NetworkError.NO_INTERNET)
        } catch (e: SerializationException) {
            return Result.Error(NetworkError.SERIALIZATION)
        }

        return when (response.status.value) {
            in 200..299 -> {
                val data = response.body<List<CryptoCurrencyModel>>()
                Result.Success(data.map { it.toCryptoCurrency() })
            }

            401 -> Result.Error(NetworkError.UNAUTHORIZED)
            409 -> Result.Error(NetworkError.CONFLICT)
            408 -> Result.Error(NetworkError.REQUEST_TIMEOUT)
            413 -> Result.Error(NetworkError.PAYLOAD_TOO_LARGE)
            in 500..599 -> Result.Error(NetworkError.SERVER_ERROR)
            else -> Result.Error(NetworkError.UNKNOWN)
        }
    }

    suspend fun getMarketChart(cryptoId: String, currency: String, days: Int): Result<List<Pair<Long, Double>>, NetworkError> {

        val response = try {
            client.get(
                urlString = "https://api.coingecko.com/api/v3/coins/$cryptoId/market_chart?vs_currency=$currency&days=$days"
            )
        } catch (e: UnresolvedAddressException) {
            return Result.Error(NetworkError.NO_INTERNET)
        } catch (e: SerializationException) {
            return Result.Error(NetworkError.SERIALIZATION)
        }

        return when (response.status.value) {
            in 200..299 -> {
                val data = response.body<MarketChartResponseModel>()
                Result.Success(data.prices.map { Pair(it[0].toLong(), it[1]) })
            }

            401 -> Result.Error(NetworkError.UNAUTHORIZED)
            409 -> Result.Error(NetworkError.CONFLICT)
            408 -> Result.Error(NetworkError.REQUEST_TIMEOUT)
            413 -> Result.Error(NetworkError.PAYLOAD_TOO_LARGE)
            in 500..599 -> Result.Error(NetworkError.SERVER_ERROR)
            else -> Result.Error(NetworkError.UNKNOWN)
        }
    }
}