package com.example.nexqora_ait.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavDestination
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.nexqora_ait.presentation.bottom_nav.navigation.BottomNavGraph
import com.example.nexqora_ait.presentation.bottom_nav.navigation.BottomNavRoute
import com.example.nexqora_ait.ui.theme.ThemeColors
import com.example.nexqora_ait.viewmodel.MainViewModel
import com.example.nexqora_ait.viewmodel.SharedViewModel
import kotlinx.serialization.Serializable

@Serializable
object MainScreen

@Composable
fun MainScreen(
    mainViewModel: MainViewModel,
    sharedViewModel: SharedViewModel,
) {

    val bottomNavController = rememberNavController()

    sharedViewModel.getCryptoCurrencies()

    Scaffold(
//        modifier = Modifier.fillMaxSize().windowInsetsPadding(WindowInsets.safeDrawing),
        contentColor = ThemeColors.BackgroundColor,
        bottomBar = { BottomNavBar(navController = bottomNavController) },
        content = { padding ->
            Column(
                modifier = Modifier
                    .background(color = ThemeColors.BackgroundColor)
                    .padding(padding)
//                    .windowInsetsPadding(WindowInsets.safeDrawing)
            ) {
                BottomNavGraph(
                    navController = bottomNavController,
                    sharedViewModel = sharedViewModel,
                    mainViewModel = mainViewModel
                )
            }
        }
    )

}

@Composable
fun BottomNavBar(
    navController: NavHostController,
) {

    val screens = listOf(
        BottomNavRoute.Home,
        BottomNavRoute.Trade,
        BottomNavRoute.Withdrawal,
        BottomNavRoute.Sentiments,
        BottomNavRoute.Portfolio
    )

    val navStackBackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navStackBackEntry?.destination

    val bottomBarDestination = screens.any { it.route == currentDestination?.route }
    if (bottomBarDestination) {
        Surface(
            modifier = Modifier.background(color = ThemeColors.BackgroundColor).fillMaxWidth(),
            shadowElevation = 10.dp
        ) {
            Row(
                modifier = Modifier
                    .background(color = ThemeColors.BackgroundColor)
                    .fillMaxWidth()
                    .padding(bottom = 5.dp, top = 5.dp)
                    .padding(
                        bottom = WindowInsets.safeDrawing.asPaddingValues().calculateBottomPadding()
                    ),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                screens.forEach { screen ->
                    AddItem(
                        screen = screen,
                        currentDestination = currentDestination,
                        navController = navController,
                    )
                }
            }
        }
    }


}

@Composable
fun AddItem(
    screen: BottomNavRoute,
    currentDestination: NavDestination?,
    navController: NavHostController,
) {

    val selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true

    val contentColor =
        if (selected) ThemeColors.blue else ThemeColors.TextColor

    val interactionSource = remember { MutableInteractionSource() }

    Box(
        modifier = Modifier
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = {
                    navController.navigate(screen.route) {
                        popUpTo(navController.graph.findStartDestination().id)
                        launchSingleTop = true
                    }
                })
            .widthIn(min = 20.dp)
            .background(
                if (selected) ThemeColors.lightBoxColor else Color.Transparent,
                shape = RoundedCornerShape(100)
            )
            .padding(horizontal = 5.dp, vertical = 5.dp),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            modifier = Modifier.size(28.dp),
            painter = painterResource(screen.icon),
            contentDescription = "icon",
            tint = contentColor
        )
    }
}
