package com.example.nexqora_ait.presentation.bottom_nav.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.example.nexqora_ait.domain.CryptoCurrency
import com.example.nexqora_ait.ui.theme.MEDIUM
import com.example.nexqora_ait.ui.theme.SMALL
import com.example.nexqora_ait.ui.theme.ThemeColors
import com.example.nexqora_ait.util.formatToTwoDecimalPlaces

@Composable
fun CryptoCurrencyItem(
    modifier: Modifier = Modifier,
    cryptoCurrency: CryptoCurrency,
    onClick: (CryptoCurrency) -> Unit
) {

    Column(modifier = modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 5.dp).clickable {
        onClick(cryptoCurrency)
    }) {

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {

            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {

                AsyncImage(
                    modifier = Modifier.clip(CircleShape).size(40.dp),
                    model = cryptoCurrency.image,
                    contentDescription = null,
                    contentScale = ContentScale.FillBounds,
//                    imageLoader = ImageLoader(context = LocalContext.current)
                )

                Spacer(modifier = Modifier.width(10.dp))

                Column {
                    Text(
                        cryptoCurrency.name,
                        fontWeight = FontWeight.Medium,
                        fontSize = MEDIUM,
                        color = ThemeColors.TextColor
                    )
                    Text(
                        cryptoCurrency.symbol,
                        fontWeight = FontWeight.Normal,
                        fontSize = SMALL,
                        color = Color.Gray
                    )
                }

            }

            Column(
                horizontalAlignment = Alignment.End
            ) {

                Text(
                    cryptoCurrency.current_price?.formatToTwoDecimalPlaces() ?: "",
                    fontWeight = FontWeight.Normal,
                    fontSize = SMALL,
                    color = ThemeColors.TextColor
                )

                Text(
                    (cryptoCurrency.price_change_percentage_24h?.formatToTwoDecimalPlaces()
                        ?: "").uppercase(),
                    fontWeight = FontWeight.Bold,
                    fontSize = SMALL,
                    color = if (cryptoCurrency.price_change_percentage_24h!! >= 0) ThemeColors.darkGreen else Color.Red
                )

            }

        }

        Spacer(modifier = Modifier.height(15.dp))

        Box(
            modifier = Modifier
                .clip(CircleShape)
                .fillMaxWidth()
                .background(Color.Gray.copy(alpha = 0.2f))
                .height(2.dp)
        )
        Spacer(modifier = Modifier.height(10.dp))

    }

}