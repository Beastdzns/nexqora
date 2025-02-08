package com.nexqora.app.bottom_nav.presentation.components

import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.times
import coil.compose.AsyncImage
import com.example.nexqora_ait.domain.CryptoCurrency
import com.example.nexqora_ait.ui.components.LineChartSingle
import com.example.nexqora_ait.ui.theme.EXTRA_LARGE
import com.example.nexqora_ait.ui.theme.LARGE
import com.example.nexqora_ait.ui.theme.MEDIUM
import com.example.nexqora_ait.ui.theme.ThemeColors
import com.example.nexqora_ait.viewmodel.SharedViewModel
import kotlin.math.max
import kotlin.math.min

private enum class PriceRange {
    ONE_DAY,
    ONE_YEAR,
}

@Composable
fun CurrencyBottomSheet(
    cryptoCurrency: CryptoCurrency,
    sharedViewModel: SharedViewModel
) {

    var selectedPriceRange by remember {
        mutableStateOf(PriceRange.ONE_YEAR)
    }

    val marketData by sharedViewModel.currencyMarketData.collectAsState()

    val scrollState = rememberScrollState()

    Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp).verticalScroll(scrollState)) {

        Row(
            horizontalArrangement = Arrangement.Center
        ) {

            AsyncImage(
                modifier = Modifier.clip(CircleShape).size(25.dp),
                model = cryptoCurrency.image,
                contentDescription = null,
                contentScale = ContentScale.FillBounds,
//                imageLoader = ImageLoader(context = LocalContext.current)
            )

            Spacer(modifier = Modifier.width(15.dp))

            Text(
                text = cryptoCurrency.name,
                fontWeight = FontWeight.Medium,
                fontSize = LARGE,
                color = ThemeColors.TextColor
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = cryptoCurrency.current_price.toString(),
                fontWeight = FontWeight.Medium,
                fontSize = EXTRA_LARGE,
                color = ThemeColors.blue
            )

            //                Text(currencyMarketChartResponse.toString())
//                Text(datesList.toString())

            if (marketData.isNotEmpty()) {
                val dataPoints = marketData.map { it.second }

                Spacer(modifier = Modifier.padding(top = 50.dp))

                Column(modifier = Modifier.fillMaxSize().height(175.dp)) {
                    LineChartSingle(
                        modifier = Modifier.fillMaxSize(),
                        chartInfo = dataPoints
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {

                        Text(
                            text = cryptoCurrency.low_24h.toString(),
                            fontSize = MEDIUM,
                            color = Color.Gray
                        )

                        Text(
                            text = cryptoCurrency.high_24h.toString(),
                            fontSize = MEDIUM,
                            color = Color.Gray
                        )

                    }

                }

//                val datesList = data.mapIndexed { index, _ -> (index + 1).toString() }

                // Calculate min and max for y-axis
//                val minY = dataPoints.minOrNull() ?: 0f
//                val maxY = dataPoints.maxOrNull() ?: 1f
//
//                val lineParameters: List<LineParameters> = listOf(
//                    LineParameters(
//                        label = "Price",
//                        data = dataPoints.map { it.toDouble() },
//                        lineColor = Color.Blue,
//                        lineType = LineType.CURVED_LINE,
//                        lineShadow = true
//                    )
//                )
//
//                LineChart(
//                    modifier = Modifier
//                        .fillMaxWidth()
//                        .height(300.dp)
//                        .padding(horizontal = 16.dp), // Avoid clipping with padding
//                    linesParameters = lineParameters,
//                    isGrid = true,
//                    gridColor = Color.LightGray,
//                    xAxisData = dataPoints.map { it.toString()  },
//                    animateChart = true,
//                    showGridWithSpacer = true,
//                    yAxisStyle = TextStyle(
//                        fontSize = 12.sp,
//                        color = Color.Gray
//                    ),
//                    xAxisStyle = TextStyle(
//                        fontSize = 12.sp,
//                        color = Color.Gray
//                    ),
//                    yAxisRange = 5, // Let the library auto-scale the Y-axis
//                    oneLineChart = false,
//                    gridOrientation = GridOrientation.VERTICAL
//                )
            }


        }

        Spacer(modifier = Modifier.height(30.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {

            Text(
                text = "Price Range",
                fontWeight = FontWeight.Medium,
                fontSize = MEDIUM,
                color = ThemeColors.TextColor
            )

            Row {
                Box(
                    modifier = Modifier
                        .clip(shape = RoundedCornerShape(80))
                        .background(if (selectedPriceRange == PriceRange.ONE_DAY) ThemeColors.lightBoxColor else Color.Transparent)
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                        .clickable {
                            selectedPriceRange = PriceRange.ONE_DAY
                        }
                ) {
                    Text(
                        "1D",
                        color = if (selectedPriceRange == PriceRange.ONE_DAY) ThemeColors.blue else Color.Gray,
                        fontSize = MEDIUM,
                    )
                }

                Spacer(modifier = Modifier.width(20.dp))

                Box(
                    modifier = Modifier
                        .clip(shape = RoundedCornerShape(80))
                        .background(if (selectedPriceRange == PriceRange.ONE_YEAR) ThemeColors.lightBoxColor else Color.Transparent)
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                        .clickable {
                            selectedPriceRange = PriceRange.ONE_YEAR
                        }
                ) {
                    Text(
                        "AT",
                        color = if (selectedPriceRange == PriceRange.ONE_YEAR) ThemeColors.blue else Color.Gray,
                        fontSize = MEDIUM,
                    )
                }

            }

        }


        Spacer(modifier = Modifier.height(20.dp))

        Column {

            RangeBar(
                lowValue = (if (selectedPriceRange == PriceRange.ONE_DAY) cryptoCurrency.low_24h else cryptoCurrency.atl) ?: 0.0,
                highValue = (if (selectedPriceRange == PriceRange.ONE_DAY) cryptoCurrency.high_24h else cryptoCurrency.ath) ?: 0.0,
                currentValue = cryptoCurrency.current_price ?: 0.0
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {

                Column {
                    Text(
                        text = "All Time Low",
                        fontSize = MEDIUM,
                        color = Color.Gray
                    )

                    Text(
                        text = cryptoCurrency.atl.toString(),
                        fontSize = MEDIUM,
                        color = ThemeColors.TextColor
                    )
                }

                Column {
                    Text(
                        text = "All Time High",
                        fontSize = MEDIUM,
                        color = Color.Gray
                    )

                    Text(
                        text = cryptoCurrency.ath.toString(),
                        fontSize = MEDIUM,
                        color = ThemeColors.TextColor
                    )
                }

            }

        }

    }

}

@Composable
fun RangeBar(
    lowValue: Double,
    highValue: Double,
    currentValue: Double,
) {
    val range = max(lowValue, highValue) - min(lowValue, highValue)
    val currentRangePercentage =
        if (range == 0.0) 0.0 else (currentValue - min(lowValue, highValue)) / range

    BoxWithConstraints(
        modifier = Modifier
            .fillMaxWidth()
//        contentAlignment = Alignment.Center
    ) {
        val totalWidth = maxWidth // Get the maximum width of the BoxWithConstraints

        // Range bar background
        Box(
            modifier = Modifier
                .clip(CircleShape)
                .fillMaxWidth()
                .height(6.dp)
                .background(ThemeColors.lightBoxColor)
                .animateContentSize()
        )

        // Filled part of the range bar up to the current value
        Box(
            modifier = Modifier
                .clip(CircleShape)
                .fillMaxWidth(fraction = currentRangePercentage.toFloat())
                .height(6.dp)
                .background(ThemeColors.primaryContainer)
                .animateContentSize()
        )

        // Marker for current value
        Box(
            modifier = Modifier
                .offset(
                    x = (currentRangePercentage * totalWidth.value.dp).coerceAtLeast(0.dp)
                )
                .clip(CircleShape)
                .width(10.dp)
                .height(6.dp)
                .background(ThemeColors.blue)
                .animateContentSize()
        )
    }
}

