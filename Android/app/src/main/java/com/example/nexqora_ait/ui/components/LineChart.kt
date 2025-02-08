package com.example.nexqora_ait.ui.components

import androidx.compose.animation.Animatable
import androidx.compose.animation.core.FastOutLinearInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import kotlin.math.roundToInt

@Composable
fun LineChartSingle(
    modifier: Modifier = Modifier,
    chartInfo: List<Double> = emptyList(),
    graphColor: Color = Color.Green,
) {
    val spacing = 100f
    val upperValue = remember(chartInfo) { (chartInfo.maxOrNull()?.plus(1))?.roundToInt() ?: 0 }
    val lowerValue = remember(chartInfo) { chartInfo.minOrNull()?.toInt() ?: 0 }

    var animate by remember { mutableStateOf(false) }
    var canvasHeight by remember { mutableStateOf(0f) }
    val animatedHeight by animateFloatAsState(
        targetValue = if (animate) canvasHeight else 0f,
        animationSpec = tween(durationMillis = 1200, easing = FastOutLinearInEasing)
    )
    val transparentGraphColor = remember { Animatable(graphColor) }

    LaunchedEffect(key1 = true) {
        animate = true
        transparentGraphColor.animateTo(graphColor, tween(2000))
    }

    Column(modifier = modifier) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            canvasHeight = size.height
            val spacePerHour = (size.width - spacing) / chartInfo.size

            val yCoordinates = List(4) { index ->
                size.height - spacing - index * (size.height - spacing) / 3.4f
            }

            var lastX = 0f
            val strokePath = androidx.compose.ui.graphics.Path().apply {
                for (i in chartInfo.indices) {
                    val currentValue = chartInfo[i]
                    val nextValue = chartInfo.getOrNull(i + 1) ?: chartInfo.last()
                    val leftRatio = (currentValue - lowerValue) / (upperValue - lowerValue)
                    val rightRatio = (nextValue - lowerValue) / (upperValue - lowerValue)

                    val x1 = spacing + i * spacePerHour
                    val y1 = animatedHeight - spacing - (leftRatio * animatedHeight).toFloat()
                    val x2 = spacing + (i + 1) * spacePerHour
                    val y2 = animatedHeight - spacing - (rightRatio * animatedHeight).toFloat()

                    if (i == 0) moveTo(x1, y1)
                    lastX = (x1 + x2) / 2f
                    quadraticBezierTo(x1, y1, lastX, (y1 + y2) / 2f)
                }
            }

            val fillPath = androidx.compose.ui.graphics.Path().apply {
                addPath(strokePath)
                lineTo(lastX, size.height - spacing)
                lineTo(spacing, size.height - spacing)
                close()
            }

            val pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f)

            // Draw horizontal grid lines
//            yCoordinates.forEach { y ->
//                drawLine(
//                    color = Color.Gray,
//                    start = Offset(x = spacing, y = y),
//                    end = Offset(x = size.width, y = y),
//                    strokeWidth = 1.dp.toPx(),
//                    pathEffect = pathEffect
//                )
//            }

            // Draw bottom axis
//            drawLine(
//                color = Color.Gray,
//                start = Offset(x = spacing - 20f, y = size.height - spacing),
//                end = Offset(x = size.width, y = size.height - spacing),
//                strokeWidth = 1.dp.toPx(),
//            )

            // Fill area under graph
//            drawPath(
//                path = fillPath,
//                brush = Brush.verticalGradient(
//                    colors = listOf(
//                        transparentGraphColor.value,
//                        Color.Transparent
//                    )
//                )
//            )

            // Draw graph line
            drawPath(
                path = strokePath,
                color = transparentGraphColor.value,
                style = Stroke(width = 2.dp.toPx(), cap = StrokeCap.Round)
            )
        }
    }
}
