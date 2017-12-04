/**
 *
 *   dealer.com navigation scraper
 *   author: cire
 *
 */

function ddc() {
    'use strict';

    let mainNavigation = document.querySelector('ul.navbar-nav');
    let navigationMenu = {};
    // save the drop down menu links
    navigationMenu.provider = 'ddc';

    /**
     *   build navigation object
     */
    let mainNavigationItems = mainNavigation.children; // save all the DROP DOWN MENU that appears when clicking on a main navigation item
    for (let z = 0; z < mainNavigationItems.length; z += 1) {
        let subMenu = {};
        let mainMenuText = mainNavigationItems[z].innerText.trim() === '' ? 'image' : mainNavigationItems[z].innerText; // get get main navigation menu item text

        /**
         *   Build drop down menu that appears after clicking the main navigation item
         */
        let title = mainNavigationItems[z].querySelectorAll('ul.nav-links'); // save all the sub menus that appear in the drop down
        for (let u = 0; u < title.length; u += 1) {
            let subMenuLinks = {};
            let subMenuTitle = title[u].parentElement.firstElementChild.innerText; // get sub menu title

            /**
             *   Loop Through sub menus and get all links information
             */
            let subLinks = title[u].querySelectorAll('li'); // get links in the sub menu
            for (let a = 0; a < subLinks.length; a += 1) {
                let subLinkInfo = {};
                let linkText = subLinks[a].innerText.trim();
                let linkURL = subLinks[a].querySelector('a').href;

                // save data into array
                subLinkInfo.Text = linkText;
                subLinkInfo.URL = linkURL;
                // save sub menu link information in sub menu object
                subMenuLinks[a] = subLinkInfo;
            }
            // save sub menu object
            subMenu[subMenuTitle] = subMenuLinks;
        }
        // save the drop down menu links
        navigationMenu[mainMenuText] = subMenu;
    }
    return navigationMenu;
}

function cdk() {
    'use strict';

    let mainNavigation = document.querySelector('nav > ul');
    let navigationMenu = {};
    // save the drop down menu links
    navigationMenu.provider = 'cdk';

    /**
     *   build navigation object
     */
    let mainNavigationItems = mainNavigation.children; // save all the DROP DOWN MENU that appears when clicking on a main navigation item
    for (let z = 0; z < mainNavigationItems.length; z += 1) {
        let subMenuLinks = {};
        let mainMenuText = mainNavigationItems[z].innerText.trim() === '' ? 'image' : mainNavigationItems[z].innerText; // get main navigation menu item text
        let subMenu = mainNavigationItems[z].querySelector('ul'); // save all the sub menus that appear in the drop down

        if (subMenu) { // check to see if the main navigation item has a sub menu
            /**
             *   Loop Through sub menus and get all links information
             */
            let subLinks = subMenu.querySelectorAll('li'); // get links in the sub menu
            for (let a = 0; a < subLinks.length; a += 1) {
                let subLinkInfo = {};
                let linkText = subLinks[a].innerText.trim();
                let linkURL = subLinks[a].querySelector('a').href;
                // save data into object
                subLinkInfo.Text = linkText;
                subLinkInfo.URL = linkURL;
                // save sub menu link information in sub menu object
                subMenuLinks[a] = subLinkInfo;
            }
        }
        // save sub menu object
        navigationMenu[mainMenuText] = subMenuLinks;
    }
    return navigationMenu;
}

function csvConvertor(JSONData, ReportTitle) {
    'use strict';

    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
    let CSV = '';
    // column titles
    let columnTitles = ['Main Nav Title', 'Sub-Nav Drop Down Title', 'Live Link Text', 'Live URL reference', 'CDK Proof URL', 'LandingPage Name'];

    //Set Report title in first row or line
    CSV += ReportTitle + '\r\n\n';

    //will generate the Label/Header
    CSV += columnTitles.join() + '\r\n\n';

    //This loop will extract the label from 1st index of on array
    for (let menu in arrData) {
        if (arrData.hasOwnProperty(menu)) {
            // skip provider key
            if (menu.indexOf('provider') > -1) {
                continue;
            }
            // build sub menu
            for (let subMenu in arrData[menu]) {
                if (arrData[menu].hasOwnProperty(subMenu)) {
                    let row = '';
                    row += menu + ',';
                    row += subMenu;
                    CSV += row + '\r\n';
                    // add sub menu links to CSV
                    for (let info in arrData[menu][subMenu]) {
                        if (arrData[menu][subMenu].hasOwnProperty(info)) {
                            let newRow = ' , , ' + arrData[menu][subMenu][info].Text + ',' + arrData[menu][subMenu][info].URL;
                            CSV += newRow + '\r\n';
                        }
                    }
                }
            }
        }
    }

    // if there is something wrong with the CSV, return an error
    if (CSV === '') {
        //alert('Invalid data');
        return;
    }

    //Initialize file format you want csv or xls
    let uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    return uri;
}

function csvConvertorCDK(JSONData, ReportTitle) {
    'use strict';

    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
    let CSV = '';
    // column titles
    let columnTitles = ['Main Nav Title', 'Live Link Text', 'Live URL reference', 'CDK Proof URL', 'LandingPage Name'];

    //Set Report title in first row or line
    CSV += ReportTitle + '\r\n\n';

    //will generate the Label/Header
    CSV += columnTitles.join() + '\r\n\n';
    debugger;
    //This loop will extract the label from 1st index of on array
    for (let menu in arrData) {
        if (arrData.hasOwnProperty(menu)) {
            // skip provider key
            if (menu.indexOf('provider') > -1) {
                continue;
            }
            // build sub menu
            let length = Object.keys(arrData[menu]).length;
            for (let q = 0; q < length; q += 1) {
                //for (let subMenu in arrData[menu]) {
                //if (arrData[menu].hasOwnProperty(subMenu)) {
                let row = '';
                if (q === 0) {
                    row += menu;
                    //row += subMenu;
                    //CSV += row;
                    CSV += row + '\r\n';
                }

                // add sub menu links to CSV
                //for (let info in arrData[menu][subMenu]) {
                //if (arrData[menu][subMenu].hasOwnProperty(info)) {
                let newRow = ' , ' + arrData[menu][q].Text + ',' + arrData[menu][q].URL;
                if (q + 1 === length) {
                    CSV += newRow + '\r\n\n';
                } else {
                    CSV += newRow + '\r\n';
                }
                //CSV += newRow + '\r\n\n';
                //}
                //}
                //}
            }
        }
    }

    // if there is something wrong with the CSV, return an error
    if (CSV === '') {
        alert('Invalid data');
        return;
    }

    //Initialize file format you want csv or xls
    let uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    return uri;
}

function addLink() {
    'use strict';

    if (this.value.indexOf('Choose Option') > -1) {
        return;
    }
    let navObj;
    let linkContainer = document.createElement('div');
    document.getElementById('navToolContainer').appendChild(linkContainer);

    // create text link
    let myLink = document.createElement('a');
    myLink.download = 'myNavigation.csv';
    myLink.innerText = '"Save link as..." to download the navigation csv';
    linkContainer.appendChild(myLink);

    //console.log(this.value);
    switch (this.value) {
        case 'ddc':
            navObj = ddc();
            myLink.href = csvConvertor(navObj, 'Navigation');
            break;
        case 'cdk':
            navObj = cdk();
            myLink.href = csvConvertorCDK(navObj, 'Navigation');
            break;
        default:
            // do nothing
    }
    //let navObj = getNavigation(this.value);
}

function addDropDown() {
    'use strict';

    let dropdownContainer = document.createElement('div');
    dropdownContainer.id = 'navToolContainer';
    dropdownContainer.style.position = 'fixed';
    dropdownContainer.style.top = '0px';
    dropdownContainer.style.left = '25%';
    dropdownContainer.style.zIndex = '9999999';
    dropdownContainer.style.padding = '5px';
    dropdownContainer.style.background = '#ffffff';
    document.body.appendChild(dropdownContainer);

    // create dropdown selection
    let myDropdown = document.createElement('select');
    myDropdown.id = 'myNavTool';
    myDropdown.onchange = addLink;
    myDropdown.style.height = '50px';
    myDropdown.style.width = 'auto';
    myDropdown.style.padding = '10px';
    myDropdown.style.color = '#ffffff';
    myDropdown.style.border = '5px solid rgb(255, 255, 255)';
    myDropdown.style.borderRadius = '10px';
    myDropdown.style.cssText = myDropdown.style.cssText + 'background: rgb(171, 30, 46) !important;'; // adding !important
    dropdownContainer.appendChild(myDropdown);

    /**
     *   create options for the dropdown selection
     */
    let myOptions = ['Choose Option', 'ddc', 'cdk'];
    for (let y = 0; y < myOptions.length; y += 1) {
        let option = document.createElement('option');
        option.value = myOptions[y];
        option.text = myOptions[y];
        myDropdown.appendChild(option);
    }
}

addDropDown();
//cdk();