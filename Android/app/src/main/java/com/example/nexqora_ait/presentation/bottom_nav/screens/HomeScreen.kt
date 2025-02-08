package com.example.nexqora_ait.presentation.bottom_nav.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowForward
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.InputChip
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.nexqora_ait.presentation.ProfileScreen
import com.example.nexqora_ait.presentation.bottom_nav.utility.BottomNavConstants
import com.example.nexqora_ait.presentation.bottom_nav.utility.BottomNavImages
import com.example.nexqora_ait.ui.theme.LARGE
import com.example.nexqora_ait.ui.theme.MEDIUM
import com.example.nexqora_ait.ui.theme.ThemeColors

@Composable
fun HomeScreen(
    navController: NavController
) {

//    WalletConnectScreen(
//        isConnecting = uiState.isConnecting,
//        balance = uiState.balance,
//        eventSink = walletViewModel::eventSink,
//    )

    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState),
        verticalArrangement = Arrangement.Top
    ) {

        Column(modifier = Modifier.fillMaxWidth()) {

            Row(
                modifier = Modifier.padding(top = 8.dp, start = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    modifier = Modifier.size(40.dp),
                    painter = painterResource(BottomNavImages.globe),
                    contentDescription = "Avatar",
                    tint = ThemeColors.TextColor
//                    alignment = Alignment.CenterStart,
//                    contentScale = androidx.compose.ui.layout.ContentScale.FillBounds
                )

                Spacer(modifier = Modifier.width(10.dp))

                Column(
                    modifier = Modifier.clickable {
                        navController.navigate(ProfileScreen)
                    }
                ) {
                    Text("@AccountID", color = ThemeColors.TextColor)
                    Text(
                        "Aditya Shinde",
                        fontWeight = FontWeight.Medium,
                        color = ThemeColors.TextColor
                    )
                }

            }


        }

        // cards
        Row(
            modifier = Modifier
                .padding(top = 14.dp)
                .padding(horizontal = 10.dp)
                .fillMaxWidth()
                .height(100.dp), // Fixed height of cards
            horizontalArrangement = Arrangement.SpaceEvenly // Space between cards
        ) {
            BottomNavConstants.HomeScreenCards.forEach { (text, image) ->
                Card(
                    modifier = Modifier
                        .weight(1f) // Equal width
                        .padding(8.dp), // spacing between cards
                    elevation = CardDefaults.elevatedCardElevation(defaultElevation = 4.dp),
                    shape = RoundedCornerShape(20),
                    colors = CardDefaults.cardColors(
                        containerColor = ThemeColors.primaryContainer
                    )
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            modifier = Modifier.size(28.dp),
                            painter = painterResource(image),
                            contentDescription = text,
                            tint = ThemeColors.blue
                        )

                        Spacer(Modifier.height(5.dp))

                        Text(
                            text = text,
                            fontWeight = FontWeight.Medium,
                            fontSize = MEDIUM,
                            color = ThemeColors.TextColor
                        )
                    }
                }
            }
        }


        Spacer(modifier = Modifier.height(50.dp))

        var bucketName by remember { mutableStateOf("") }
        var networkName by remember { mutableStateOf("") }
        var networkMenuOpen by remember { mutableStateOf(false) }
        var networks = mutableListOf(
            "Arbitrum",
            "Base",
            "Polygon"
        )

        Column(
            modifier = Modifier
                .padding(20.dp)
                .background(ThemeColors.lightBoxColor)
                .padding(horizontal = 15.dp, vertical = 20.dp)
                .clip(shape = RoundedCornerShape(20.dp))
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            Text(
                "Create Your Mutual Fund",
                color = ThemeColors.TextColor,
                fontSize = LARGE,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(30.dp))

            OutlinedTextField(
                modifier = Modifier.fillMaxWidth(),
                value = bucketName,
                onValueChange = {
                    bucketName = it
                },
                label = {
                    Text("Bucket Name", color = ThemeColors.TextColor)
                }
            )

            Spacer(modifier = Modifier.height(30.dp))

            Column(
                modifier = Modifier.clickable {
                    networkMenuOpen = !networkMenuOpen
                }
            ) {
                OutlinedTextField(
                    modifier = Modifier.fillMaxWidth(),
                    value = networkName,
                    onValueChange = {

                    },
                    enabled = false,
                    label = {
                        Text("Select Network", color = ThemeColors.TextColor)
                    },
                    colors = OutlinedTextFieldDefaults.colors(
                        disabledBorderColor = ThemeColors.TextColor,
                        disabledTextColor = ThemeColors.TextColor
                    )
                )

                if (networkMenuOpen) {
                    DropdownMenu(expanded = true, onDismissRequest = {
                        networkMenuOpen = false
                    }) {
                        networks.forEach {
                            DropdownMenuItem(
                                text = { Text(it) },
                                onClick = {
                                    networkName = it
                                }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(30.dp))

            CurrencyClip(
                list = listOf("WETH", "WBTC", "DAI", "LINK", "ETH")
            ) { }

            Spacer(modifier = Modifier.height(30.dp))

            Button(
                onClick = {

                }
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Create", modifier = Modifier.padding(end = 10.dp))
                    Icon(
                        imageVector = Icons.Rounded.ArrowForward,
                        contentDescription = ""
                    )

                }
            }

        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun CurrencyClip(
    list: List<String>,
    mapChanged: (Map<String, String>) -> Unit
) {

    val map by remember { mutableStateOf(mapOf<String, String>()) }

    FlowRow(modifier = Modifier.fillMaxWidth()) {

        list.forEach {

            var value by remember { mutableStateOf("0") }

            Card(
                modifier = Modifier.padding(5.dp),
                border = BorderStroke(
                    width = 1.dp, color = try {
                        if (map.getValue(it)
                                .toInt() > 0
                        ) ThemeColors.darkGreen else Color.Transparent
                    } catch (e: Exception) {
                        Color.Transparent
                    }
                ),
//                shape = RoundedCornerShape(0),
                colors = CardDefaults.cardColors(
                    containerColor = ThemeColors.primaryContainer
                )
            ) {
                Row(
                    modifier = Modifier.padding(vertical = 2.dp, horizontal = 5.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {

                    Text(text = it)
                    TextField(
                        modifier = Modifier
                            .widthIn(max = 60.dp)
                            .height(50.dp),
                        value = "$value",
                        onValueChange = {
                            value = it
                            map.plus(it to value)
                            mapChanged(map)
                        },
                        singleLine = true,
                        colors = TextFieldDefaults.colors(
                            focusedTextColor = ThemeColors.TextColor,
                            unfocusedTextColor = ThemeColors.TextColor,
                            focusedContainerColor = Color.Transparent,
                            unfocusedContainerColor = Color.Transparent,
                            focusedIndicatorColor = Color.Transparent,
                            unfocusedIndicatorColor = Color.Transparent,
                            focusedLeadingIconColor = ThemeColors.TextColor,
                            unfocusedLeadingIconColor = ThemeColors.TextColor
                        )
                    )
                }
            }
        }

    }

}