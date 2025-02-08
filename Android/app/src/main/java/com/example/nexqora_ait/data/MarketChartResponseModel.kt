package com.example.nexqora_ait.data

import kotlinx.serialization.Serializable

@Serializable
data class MarketChartResponseModel(
    val prices: List<List<Double>> // Nested lists: [timestamp, price]
)
