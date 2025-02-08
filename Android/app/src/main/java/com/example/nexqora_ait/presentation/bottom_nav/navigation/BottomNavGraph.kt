package com.example.nexqora_ait.presentation.bottom_nav.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.nexqora_ait.nav.Graph
import com.example.nexqora_ait.presentation.ProfileScreen
import com.example.nexqora_ait.presentation.bottom_nav.screens.HomeScreen
import com.example.nexqora_ait.presentation.bottom_nav.screens.PortfolioScreen
import com.example.nexqora_ait.presentation.bottom_nav.screens.SentimentsScreen
import com.example.nexqora_ait.presentation.bottom_nav.screens.TradeScreen
import com.example.nexqora_ait.presentation.bottom_nav.screens.WithdrawalScreen
import com.example.nexqora_ait.viewmodel.MainViewModel
import com.example.nexqora_ait.viewmodel.SharedViewModel

@Composable
fun BottomNavGraph(
    navController: NavHostController,
    sharedViewModel: SharedViewModel,
    mainViewModel: MainViewModel
) {

    NavHost(
        navController = navController,
        route = Graph.BOTTOM_NAV_GRAPH,
        startDestination = BottomNavigationRoutes.TRADE
    ) {

        composable(BottomNavigationRoutes.HOME) {
            HomeScreen(navController = navController)
        }

        composable(BottomNavigationRoutes.TRADE) {
            TradeScreen(
                navController = navController,
                sharedViewModel = sharedViewModel
            )
        }

        composable(BottomNavigationRoutes.WITHDRAW) {
            WithdrawalScreen()
        }

        composable(BottomNavigationRoutes.SENTIMENTS) {
            SentimentsScreen()
        }

        composable(BottomNavigationRoutes.PORTFOLIO) {
            PortfolioScreen()
        }

        composable<ProfileScreen> {
            ProfileScreen(navController = navController, mainViewModel = mainViewModel)
        }

    }

}