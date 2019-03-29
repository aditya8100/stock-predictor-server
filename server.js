const request = require('request');
const express = require('express');
var app = express();
var lastDateRefreshed = new Date();
var s_p500 = ["A","AAL","AAP","AAPL","ABBV","ABC","ABT","ACN","ADBE","ADI","ADM","ADP","ADS","ADSK","AEE","AEP","AES","AET","AFL","AGN","AIG","AIV","AIZ","AJG","AKAM","ALB","ALGN","ALK","ALL","ALLE","ALXN","AMAT","AMD","AME","AMG","AMGN","AMP","AMT","AMZN","ANDV","ANSS","ANTM","AON","AOS","APA","APC","APD","APH","APTV","ARE","ARNC","ATVI","AVB","AVGO","AVY","AWK","AXP","AYI","AZO","BA","BAC","BAX","BBT","BBY","BDX","BEN","BF.B","BHF","BHGE","BIIB","BK","BKNG","BLK","BLL","BMY","BRK.B","BSX","BWA","BXP","C","CA","CAG","CAH","CAT","CB","CBOE","CBRE","CBS","CCI","CCL","CDNS","CELG","CERN","CF","CFG","CHD","CHRW","CHTR","CI","CINF","CL","CLX","CMA","CMCSA","CME","CMG","CMI","CMS","CNC","CNP","COF","COG","COL","COO","COP","COST","COTY","CPB","CRM","CSCO","CSX","CTAS","CTL","CTSH","CTXS","CVS","CVX","CXO","D","DAL","DE","DFS","DG","DGX","DHI","DHR","DIS","DISCA","DISCK","DISH","DLR","DLTR","DOV","DPS","DRE","DRI","DTE","DUK","DVA","DVN","DWDP","DXC","EA","EBAY","ECL","ED","EFX","EIX","EL","EMN","EMR","EOG","EQIX","EQR","EQT","ES","ESRX","ESS","ETFC","ETN","ETR","EVHC","EW","EXC","EXPD","EXPE","EXR","F","FAST","FB","FBHS","FCX","FDX","FE","FFIV","FIS","FISV","FITB","FL","FLIR","FLR","FLS","FMC","FOX","FOXA","FRT","FTI","FTV","GD","GE","GGP","GILD","GIS","GLW","GM","GOOG","GOOGL","GPC","GPN","GPS","GRMN","GS","GT","GWW","HAL","HAS","HBAN","HBI","HCA","HCP","HD","HES","HIG","HII","HLT","HOG","HOLX","HON","HP","HPE","HPQ","HRB","HRL","HRS","HSIC","HST","HSY","HUM","IBM","ICE","IDXX","IFF","ILMN","INCY","INFO","INTC","INTU","IP","IPG","IPGP","IQV","IR","IRM","ISRG","IT","ITW","IVZ","JBHT","JCI","JEC","JNJ","JNPR","JPM","JWN","K","KEY","KHC","KIM","KLAC","KMB","KMI","KMX","KO","KORS","KR","KSS","KSU","L","LB","LEG","LEN","LH","LKQ","LLL","LLY","LMT","LNC","LNT","LOW","LRCX","LUK","LUV","LYB","M","MA","MAA","MAC","MAR","MAS","MAT","MCD","MCHP","MCK","MCO","MDLZ","MDT","MET","MGM","MHK","MKC","MLM","MMC","MMM","MNST","MO","MON","MOS","MPC","MRK","MRO","MS","MSCI","MSFT","MSI","MTB","MTD","MU","MYL","NAVI","NBL","NCLH","NDAQ","NEE","NEM","NFLX","NFX","NI","NKE","NKTR","NLSN","NOC","NOV","NRG","NSC","NTAP","NTRS","NUE","NVDA","NWL","NWS","NWSA","O","OKE","OMC","ORCL","ORLY","OXY","PAYX","PBCT","PCAR","PCG","PEG","PEP","PFE","PFG","PG","PGR","PH","PHM","PKG","PKI","PLD","PM","PNC","PNR","PNW","PPG","PPL","PRGO","PRU","PSA","PSX","PVH","PWR","PX","PXD","PYPL","QCOM","QRVO","RCL","RE","REG","REGN","RF","RHI","RHT","RJF","RL","RMD","ROK","ROP","ROST","RRC","RSG","RTN","SBAC","SBUX","SCG","SCHW","SEE","SHW","SIVB","SJM","SLB","SLG","SNA","SNPS","SO","SPG","SPGI","SRCL","SRE","STI","STT","STX","STZ","SWK","SWKS","SYF","SYK","SYMC","SYY","T","TAP","TDG","TEL","TGT","TIF","TJX","TMK","TMO","TPR","TRIP","TROW","TRV","TSCO","TSN","TSS","TTWO","TWX","TXN","TXT","UA","UAA","UAL","UDR","UHS","ULTA","UNH","UNM","UNP","UPS","URI","USB","UTX","V","VAR","VFC","VIAB","VLO","VMC","VNO","VRSK","VRSN","VRTX","VTR","VZ","WAT","WBA","WDC","WEC","WELL","WFC","WHR","WLTW","WM","WMB","WMT","WRK","WU","WY","WYN","WYNN","XEC","XEL","XL","XLNX","XOM","XRAY","XRX","XYL","YUM","ZBH","ZION","ZTS"];
var s_p500test = ["A","AAL","AAP","AAPL","ABBV","ABC","ABT","ACN","ADBE","COTY"];
var losers = [];
var percentages = [];
var dateToSend;
var date = new Date();
var localTime = date.getTime();
var localOffset = date.getTimezoneOffset() * 60000;
var utc = localTime + localOffset;
var stockCounter = 1;
var offset = -4;
var nyc = utc + (3600000 * offset);

lastDateRefreshed = new Date(nyc);

console.log("Date in initial: " + lastDateRefreshed.toLocaleString());

s_p500test.forEach(function(stock) {
    let open = 0, close = 0;
    let url1 = "https://cloud.iexapis.com/beta/stock/" + stock.toLowerCase() + "/chart/1m?token=pk_6e1d34b7c5bb4d369d2d314043cf4abf";
        
    request.get(url1, (err,body,response) => {
        if (err != null) {
            console.log(err);
            return;
        }
        console.log(stockCounter + ": Inside initial request: " + stock);
            
        /*
        var indexOfhigh = response.indexOf("<tr class=\"in-the-money\">");
        var indexOfDate = indexOfhigh + ("<tr class=\"in-the-money\">").length + ("<td class=\"date\">").length + 9;
        var indexOfDateEnd = response.indexOf("</td>",indexOfDate);
        dateToSend = response.substring(indexOfDate,indexOfDateEnd);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = indexOfhigh + 16;
        indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
        open = response.substring(indexOfhigh,indexOfHighEnd);
                        
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        indexOfhigh = indexOfhigh + 16;
        indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
        close = response.substring(indexOfhigh,indexOfHighEnd);
        */      
       
       console.log("Response response: " + response);
        console.log("Response body: " + body);
        console.log("Length:"  + body.length);
                    
        // indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        // indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        // indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        // indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        // indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
        // indexOfhigh = indexOfhigh + 16;
        // indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
        // daybeforeyesterday = response.substring(indexOfhigh,indexOfHighEnd);
                
        console.log("Stock: " + stock + ", Open: " + open + ", Close: " + close + ", Date To Send: " + dateToSend);
                    
        if (open != 0 && close != 0) {
            let percentageDrop = ((open - close)/open) * 100;
            // let daybeforeyesterdayToYesterdayPercentage = ((daybeforeyesterday - yesterday)/daybeforeyesterday) * 100;
            console.log("Open To Close Drop: " + percentageDrop);
                
            if (percentageDrop > 4) {
                console.log('Inside initial adding to map!')
                losers.push(stock);
                percentages.push(percentageDrop);
                console.log('Number of entries: ' + losers.size)
            }
        }  
        stockCounter++;  
    });
});

app.listen(process.env.PORT || 1337, () => console.log('server is listening'));

app.get("/losers", (req,res) => {
    console.log("Date sending: " + dateToSend)
    var response = {"date": dateToSend, "losers": losers, "percentages": percentages};
    res.status(200).send(response);
});

app.get("/",(req,res) => {
    res.status(200).send("Endpoint doesn't exist.!")
});

setInterval(function() {
    date = new Date();
    localTime = date.getTime();
    localOffset = date.getTimezoneOffset() * 60000;
    utc = localTime + localOffset;

    offset = -4;
    nyc = utc + (3600000 * offset);

    newDate = new Date(nyc);

    console.log('Date in refresh: ' + newDate.toLocaleString() + ", Number of losers: " + losers.length);

    if (lastDateRefreshed.getDay() != newDate.getDay()) {
        lastDateRefreshed = newDate;
        losers = [];
        percentages = [];
        s_p500.forEach(function(stock) {
            let open = 0, close = 0;
            let url1 = "https://www.investopedia.com/markets/stocks/" + stock.toLowerCase() + "/historical/"
                
            request.get(url1, (err,body,response) => {
                console.log("Inside refresh request!");
                if (err != null) {
                    console.log(err);
                    return;
                }
                    
                var indexOfhigh = response.indexOf("<tr class=\"in-the-money\">");
                indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
                indexOfhigh = indexOfhigh + 16;
                indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
                open = response.substring(indexOfhigh,indexOfHighEnd);
                                
                indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
                indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
                indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
                indexOfhigh = indexOfhigh + 16;
                indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
                close = response.substring(indexOfhigh,indexOfHighEnd);
                            
                            
                // indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
                // indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
                // indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
                // indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
                // indexOfhigh = response.indexOf("<td class=\"num\">",indexOfhigh + 1);
                // indexOfhigh = indexOfhigh + 16;
                // indexOfHighEnd = response.indexOf("</td>",indexOfhigh);
                // daybeforeyesterday = response.substring(indexOfhigh,indexOfHighEnd);
                        
                console.log("Stock: " + stock + ", Open: " + open + ", Close: " + close);
                            
                if (open != 0 && close != 0) {
                    let percentageDrop = ((open - close)/open) * 100;
                    // let daybeforeyesterdayToYesterdayPercentage = ((daybeforeyesterday - yesterday)/daybeforeyesterday) * 100;
                    console.log("Open To Close Drop: " + percentageDrop);
                        
                    if (percentageDrop > 4) {
                        console.log('Inside initial adding to map!')
                        losers.push(stock);
                        percentages.push(percentageDrop);
                        console.log('Number of entries: ' + losers.size)
                    }
                }    
            });
        });
    }
},60000);