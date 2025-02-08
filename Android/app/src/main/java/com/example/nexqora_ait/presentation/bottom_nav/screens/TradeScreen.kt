package com.example.nexqora_ait.presentation.bottom_nav.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.example.nexqora_ait.domain.CryptoCurrency
import com.example.nexqora_ait.presentation.bottom_nav.components.CryptoCurrencyItem
import com.example.nexqora_ait.ui.theme.ThemeColors
import com.example.nexqora_ait.viewmodel.SharedViewModel
import com.nexqora.app.bottom_nav.presentation.components.CurrencyBottomSheet

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TradeScreen(
    navController: NavController,
    sharedViewModel: SharedViewModel
) {

    val data by sharedViewModel.cryptoCurrencyList.collectAsState()
    val scrollState = rememberScrollState()

    var isBottomSheetVisible by remember {
        mutableStateOf(false)
    }

    var cryptoCurrency by remember {
        mutableStateOf<CryptoCurrency?>(null)
    }

//    val screenHeight = (LocalWindowInfo.current.containerSize.height*0.8f).dp

    Box(
        modifier = Modifier.fillMaxSize()
    ) {

        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(state = scrollState),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            data.forEach {
                CryptoCurrencyItem(cryptoCurrency = it, onClick = { selectedCurrency ->
                    sharedViewModel.emptyMarketChart()
                    sharedViewModel.getMarketChart(selectedCurrency.id)
                    cryptoCurrency = selectedCurrency
                    isBottomSheetVisible = true
                })
            }

        }

        if (isBottomSheetVisible) {
            ModalBottomSheet(
                modifier = Modifier.fillMaxHeight(),
                containerColor = ThemeColors.BackgroundColor,
                onDismissRequest = {
                    isBottomSheetVisible = false
                }
            ) {
                CurrencyBottomSheet(
                    cryptoCurrency = cryptoCurrency!!,
                    sharedViewModel = sharedViewModel
                )
            }
        }


    }


}