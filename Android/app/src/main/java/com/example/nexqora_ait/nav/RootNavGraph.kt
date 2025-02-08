package com.example.nexqora_ait.nav

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.nexqora_ait.presentation.MainScreen
import com.example.nexqora_ait.presentation.bottom_nav.HomeScreen
import com.example.nexqora_ait.viewmodel.MainViewModel
import com.example.nexqora_ait.viewmodel.SharedViewModel

@Composable
fun RootNavGraph(
    navController: NavHostController,
    mainViewModel: MainViewModel,
    sharedViewModel: SharedViewModel,
) {

    NavHost(
        navController = navController,
        route = Graph.ROOT_NAV_GRAPH,
        startDestination = Graph.ON_START_NAV_GRAPH
    ) {

        onStartNavGraph(
            navController = navController,
            mainViewModel = mainViewModel
        )

        composable<MainScreen> {
            MainScreen(
                mainViewModel = mainViewModel,
                sharedViewModel = sharedViewModel,
            )
        }
    }

}