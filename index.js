const request = require('request');
const express = require('express');
var app = express();
var lastDateRefreshed = new Date();
const s_p500 = ["A","AAL","AAP","AAPL","ABBV","ABC","ABT","ACN","ADBE","ADI","ADM","ADP","ADS","ADSK","AEE","AEP","AES","AET","AFL","AGN","AIG","AIV","AIZ","AJG","AKAM","ALB","ALGN","ALK","ALL","ALLE","ALXN","AMAT","AMD","AME","AMG","AMGN","AMP","AMT","AMZN","ANDV","ANSS","ANTM","AON","AOS","APA","APC","APD","APH","APTV","ARE","ARNC","ATVI","AVB","AVGO","AVY","AWK","AXP","AYI","AZO","BA","BAC","BAX","BBT","BBY","BDX","BEN","BF.B","BHF","BHGE","BIIB","BK","BKNG","BLK","BLL","BMY","BRK.B","BSX","BWA","BXP","C","CA","CAG","CAH","CAT","CB","CBOE","CBRE","CBS","CCI","CCL","CDNS","CELG","CERN","CF","CFG","CHD","CHRW","CHTR","CI","CINF","CL","CLX","CMA","CMCSA","CME","CMG","CMI","CMS","CNC","CNP","COF","COG","COL","COO","COP","COST","COTY","CPB","CRM","CSCO","CSX","CTAS","CTL","CTSH","CTXS","CVS","CVX","CXO","D","DAL","DE","DFS","DG","DGX","DHI","DHR","DIS","DISCA","DISCK","DISH","DLR","DLTR","DOV","DPS","DRE","DRI","DTE","DUK","DVA","DVN","DWDP","DXC","EA","EBAY","ECL","ED","EFX","EIX","EL","EMN","EMR","EOG","EQIX","EQR","EQT","ES","ESRX","ESS","ETFC","ETN","ETR","EVHC","EW","EXC","EXPD","EXPE","EXR","F","FAST","FB","FBHS","FCX","FDX","FE","FFIV","FIS","FISV","FITB","FL","FLIR","FLR","FLS","FMC","FOX","FOXA","FRT","FTI","FTV","GD","GE","GGP","GILD","GIS","GLW","GM","GOOG","GOOGL","GPC","GPN","GPS","GRMN","GS","GT","GWW","HAL","HAS","HBAN","HBI","HCA","HCP","HD","HES","HIG","HII","HLT","HOG","HOLX","HON","HP","HPE","HPQ","HRB","HRL","HRS","HSIC","HST","HSY","HUM","IBM","ICE","IDXX","IFF","ILMN","INCY","INFO","INTC","INTU","IP","IPG","IPGP","IQV","IR","IRM","ISRG","IT","ITW","IVZ","JBHT","JCI","JEC","JNJ","JNPR","JPM","JWN","K","KEY","KHC","KIM","KLAC","KMB","KMI","KMX","KO","KORS","KR","KSS","KSU","L","LB","LEG","LEN","LH","LKQ","LLL","LLY","LMT","LNC","LNT","LOW","LRCX","LUK","LUV","LYB","M","MA","MAA","MAC","MAR","MAS","MAT","MCD","MCHP","MCK","MCO","MDLZ","MDT","MET","MGM","MHK","MKC","MLM","MMC","MMM","MNST","MO","MON","MOS","MPC","MRK","MRO","MS","MSCI","MSFT","MSI","MTB","MTD","MU","MYL","NAVI","NBL","NCLH","NDAQ","NEE","NEM","NFLX","NFX","NI","NKE","NKTR","NLSN","NOC","NOV","NRG","NSC","NTAP","NTRS","NUE","NVDA","NWL","NWS","NWSA","O","OKE","OMC","ORCL","ORLY","OXY","PAYX","PBCT","PCAR","PCG","PEG","PEP","PFE","PFG","PG","PGR","PH","PHM","PKG","PKI","PLD","PM","PNC","PNR","PNW","PPG","PPL","PRGO","PRU","PSA","PSX","PVH","PWR","PX","PXD","PYPL","QCOM","QRVO","RCL","RE","REG","REGN","RF","RHI","RHT","RJF","RL","RMD","ROK","ROP","ROST","RRC","RSG","RTN","SBAC","SBUX","SCG","SCHW","SEE","SHW","SIVB","SJM","SLB","SLG","SNA","SNPS","SO","SPG","SPGI","SRCL","SRE","STI","STT","STX","STZ","SWK","SWKS","SYF","SYK","SYMC","SYY","T","TAP","TDG","TEL","TGT","TIF","TJX","TMK","TMO","TPR","TRIP","TROW","TRV","TSCO","TSN","TSS","TTWO","TWX","TXN","TXT","UA","UAA","UAL","UDR","UHS","ULTA","UNH","UNM","UNP","UPS","URI","USB","UTX","V","VAR","VFC","VIAB","VLO","VMC","VNO","VRSK","VRSN","VRTX","VTR","VZ","WAT","WBA","WDC","WEC","WELL","WFC","WHR","WLTW","WM","WMB","WMT","WRK","WU","WY","WYN","WYNN","XEC","XEL","XL","XLNX","XOM","XRAY","XRX","XYL","YUM","ZBH","ZION","ZTS"];
var s_p500test = ["A","AAL","AAP","AAPL","ABBV","ABC","ABT","ACN","ADBE","COTY"];
var losers = [];
var percentages = [];

lastDateRefreshed = new Date();
s_p500.forEach(function(stock) {
    let today = 0, yesterday = 0, daybeforeyesterday = 0;
    let url1 = "https://www.investopedia.com/markets/stocks/" + stock.toLowerCase() + "/historical/"
        
    request.get(url1, (err,body,response) => {
        console.log("Inside initial request!");
            
        var indexOfhigh = response.indexOf("<tr class=\"in-the-money\">");
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = indexOfhigh + 16;
        indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
        today = response.substring(indexOfhigh,indexOfHighEnd);
                        
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = indexOfhigh + 16;
        indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
        yesterday = response.substring(indexOfhigh,indexOfHighEnd);
                    
                    
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = indexOfhigh + 16;
        indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
        daybeforeyesterday = response.substring(indexOfhigh,indexOfHighEnd);
                
        console.log("Stock: " + stock + ", Day before yesterday: " + daybeforeyesterday + ", Yesterday: " + yesterday + ", Today: " + today);
                    
        if (today != 0 && yesterday != 0) {
            let yesterdayToTodayPercentage = ((yesterday - today)/yesterday) * 100;
            let daybeforeyesterdayToYesterdayPercentage = ((daybeforeyesterday - yesterday)/daybeforeyesterday) * 100;
            console.log("Day Before Yesterday To Yesterday drop: " + daybeforeyesterdayToYesterdayPercentage + ", Yesterday to Today Drop: " + yesterdayToTodayPercentage);
                
            if (yesterdayToTodayPercentage > 4) {
                console.log('Inside initial adding to map!')
                losers.push(stock);
                percentages.push(yesterdayToTodayPercentage);
                console.log('Number of entries: ' + losers.size)
            }
        }    
    });
});

app.listen(process.env.PORT || 1337, () => console.log('server is listening'));

app.get("/losers", (req,res) => {
    var response = {"losers": losers, "percentages": percentages};
    res.status(200).send(response);
});

app.get("/",(req,res) => {
    res.status(200).send("Endpoint doesn't exist.!")
});

setInterval(function() {
    if (lastDateRefreshed.getDay() != new Date().getDay()) {
        lastDateRefreshed = new Date();
        losers = [];
        s_p500.forEach(function(stock) {
            let today = 0, yesterday = 0, daybeforeyesterday = 0;
            let url1 = "https://www.investopedia.com/markets/stocks/" + stock.toLowerCase() + "/historical/"
        
            request.get(url1, (err,response,body) => {
              console.log("Inside refresh request: " + response);
        
              var indexOfhigh = response.indexOf("<tr class=\"in-the-money\">");
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = indexOfhigh + 16;
              indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
              today = response.substring(indexOfhigh,indexOfHighEnd);
              
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = indexOfhigh + 16;
              indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
              yesterday = response.substring(indexOfhigh,indexOfHighEnd);
        
        
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
              indexOfhigh = indexOfhigh + 16;
              indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
              daybeforeyesterday = response.substring(indexOfhigh,indexOfHighEnd);
        
              console.log("Stock: " + stock + ", Day before yesterday: " + daybeforeyesterday + ", Yesterday: " + yesterday + ", Today: " + today);
              
              if (today != 0 && yesterday != 0) {
                let yesterdayToTodayPercentage = ((yesterday - today)/yesterday) * 100;
                let daybeforeyesterdayToYesterdayPercentage = ((daybeforeyesterday - yesterday)/daybeforeyesterday) * 100;
                console.log("Day Before Yesterday To Yesterday drop: " + daybeforeyesterdayToYesterdayPercentage + ", Yesterday to Today Drop: " + yesterdayToTodayPercentage);
        
                if (yesterdayToTodayPercentage > 4) {
                  losers.push(stock);
                  percentages.push(yesterdayToTodayPercentage);
                }
              }
            });
        });
    }
},3000);