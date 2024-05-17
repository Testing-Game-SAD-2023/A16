package com.example;

import java.io.File;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.UnexpectedAlertBehaviour;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.WebElement; // aggiunto
import org.openqa.selenium.JavascriptExecutor; //aggiunto
import org.openqa.selenium.Alert; //aggiunto

public class EditorTest {
    private static ChromeDriver driver;
    private static int timeout = 100;

    @BeforeClass
    public static void setDriver() {
        System.setProperty("webdriver.chrome.driver", "/usr/local/bin/chromedriver-linux64/chromedriver");
    }

    @Before
    public void openBrowser(){
        ChromeOptions options = new ChromeOptions();
        options.setCapability(CapabilityType.UNEXPECTED_ALERT_BEHAVIOUR, UnexpectedAlertBehaviour.ACCEPT);
        HashMap<String, Object> chromePrefs = new HashMap<String, Object>();
        chromePrefs.put("profile.default_content_settings.popups", 0);
        chromePrefs.put("download.default_directory", "/home/antosavi/A16");
        options.setExperimentalOption("prefs", chromePrefs);

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(timeout, TimeUnit.SECONDS);

        driver.get("http://localhost/login");	
        driver.findElement(By.id("email")).sendKeys("prova@gmail.com");
        driver.findElement(By.id("password")).sendKeys("Prova123");
        driver.findElement(By.cssSelector("input[type=submit]")).click();

        WebDriverWait wait = new WebDriverWait(driver, timeout);

        String urlPaginaDiRedirezione = "http://localhost/main";
        try {
            wait.until(ExpectedConditions.urlToBe(urlPaginaDiRedirezione));
        } catch(TimeoutException e) {
            Assert.fail();
        }
    } 

    @After
    public void closeBrowser(){
        driver.close();
    } 

    /*
    @Test
    public void download() throws InterruptedException {
        driver.findElement(By.id("0")).click();

        driver.findElement(By.id("downloadButton")).click();

        File f = new File("C:\\Users\\luix1\\Downloads\\class.java"); 
        
        Thread.sleep(5000);
        
        Assert.assertTrue(f.exists());
    } */

    public void moveToReport(String urlPaginaDiRedirezione) {
        driver.findElement(By.id("downloadButton1")).click();
        driver.findElement(By.xpath("//button[text()='Sfida un Robot']")).click();

        /* per BossRush
         * 
         * driver.findElement(By.xpath("//button[text()='Sfida tutti i Robot']")).click();
         * driver.findElement(By.id("0")).click();
         * driver.findElement(By.xpath("//button[text()='Play against all Robots']")).click();
         */

        driver.findElement(By.id("0")).click();
        driver.findElement(By.id("0-1")).click();
        driver.findElement(By.xpath("//button[text()='Submit']")).click();

        WebDriverWait wait = new WebDriverWait(driver, timeout);

        try {
            wait.until(ExpectedConditions.urlToBe(urlPaginaDiRedirezione));
        } catch(TimeoutException e) {
            Assert.fail();
        }
    }

    @Test
    public void selection() {
        String urlPaginaDiRedirezione = "http://localhost/report";
        // BOSSRUSH String urlPaginaDiRedirezione = "http://localhost/report1";

        moveToReport(urlPaginaDiRedirezione);

        Assert.assertEquals("Test fallito! La selezione non è avvenuta correttamente.", driver.getCurrentUrl(), urlPaginaDiRedirezione);
    }

    public void moveToEditor(String urlPaginaDiRedirezione) {
        moveToReport("http://localhost/report");
        // BOSSRUSH moveToReport("http://localhost/report1");
        driver.findElement(By.xpath("//button[text()='Submit']")).click();

        WebDriverWait wait = new WebDriverWait(driver, timeout);

        try {
            wait.until(ExpectedConditions.urlToBe(urlPaginaDiRedirezione));
        } catch(TimeoutException e) {
            Assert.fail();
        }
    }

    /*
    @Test
    public void logout_main() {
        WebDriverWait wait = new WebDriverWait(driver, timeout);

        driver.findElement(By.id("logoutButton")).click();

        Alert alert = driver.switchTo().alert();
        alert.accept(); // clicco su conferma per effettuare il logout

        try {
            wait.until(ExpectedConditions.urlToBe("http://localhost/login"));
        } catch(TimeoutException e) {
            Assert.fail();
        }
    }*/

    @Test
    public void startGame() { // A16 ridondante
        String urlPaginaDiRedirezione = "http://localhost/editor";
        moveToEditor(urlPaginaDiRedirezione);

        Assert.assertEquals("Test fallito! L'avvio della partita non è avvenuto correttamente.", driver.getCurrentUrl(), urlPaginaDiRedirezione);
    } 

    
    @Test
    public void compile() {
        String urlPaginaDiRedirezione = "http://localhost/editor";
        moveToEditor(urlPaginaDiRedirezione);

        WebDriverWait wait = new WebDriverWait(driver, timeout);

        try {
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#sidebar-textarea + div > * div.CodeMirror-code > *"), 1));
        } catch(TimeoutException e) {
            Assert.fail();
        }

        // Trova l'elemento CodeMirror
        WebElement codeMirrorElement = driver.findElement(By.cssSelector("#editor + div"));

    
    // Inserisci il tuo testo nell'editor CodeMirror
    String code = "import org.junit.Before;\n" +
    "import org.junit.After;\n" +
    "import org.junit.BeforeClass;\n" +
    "import org.junit.AfterClass;\n" +
    "import org.junit.Test;\n" +
    "import static org.junit.Assert.*;\n" +
    "\n" +
    "//scrivere al posto di \"TestClasse\" il nome della classe da testare\n" +
    "public class TestCalcolatrice {\n" +
    "    private static Calcolatrice cut;\n\n" +
    "    @BeforeClass\n" +
    "    public static void setup() {\n" +
    "        cut = new Calcolatrice();\n" +
    "    }\n\n" +
    "    @Test\n" +
    "    public void testDivide() {\n" +
    "        int result = cut.divide(10, 2);\n" +
    "        assertEquals(5, result);\n" +
    "    }\n\n" +
    "    @Test(expected = ArithmeticException.class)\n" +
    "    public void testDivideByZero() {\n" +
    "        cut.divide(10, 0);\n" +
    "    }\n" +
    "}\n";
        ((JavascriptExecutor) driver).executeScript("arguments[0].CodeMirror.setValue(arguments[1]);", codeMirrorElement, code);
        
        driver.findElement(By.id("compileButton")).click();

        try {
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#console-textarea + div > * div.CodeMirror-code > *"), 1));
        } catch(TimeoutException e) {
            Assert.fail();
        }
    } 

    
    @Test
    public void run() {
        String urlPaginaDiRedirezione = "http://localhost/editor";
        moveToEditor(urlPaginaDiRedirezione);

        WebDriverWait wait = new WebDriverWait(driver, timeout);

        try {
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#sidebar-textarea + div > * div.CodeMirror-code > *"), 1));
        } catch(TimeoutException e) {
            Assert.fail();
        }

        // Trova l'elemento CodeMirror
        WebElement codeMirrorElement = driver.findElement(By.cssSelector("#editor + div"));

            // Inserisci il tuo testo nell'editor CodeMirror
    String code = "import org.junit.Before;\n" +
    "import org.junit.After;\n" +
    "import org.junit.BeforeClass;\n" +
    "import org.junit.AfterClass;\n" +
    "import org.junit.Test;\n" +
    "import static org.junit.Assert.*;\n" +
    "\n" +
    "//scrivere al posto di \"TestClasse\" il nome della classe da testare\n" +
    "public class TestCalcolatrice {\n" +
    "    private static Calcolatrice cut;\n\n" +
    "    @BeforeClass\n" +
    "    public static void setup() {\n" +
    "        cut = new Calcolatrice();\n" +
    "    }\n\n" +
    "    @Test\n" +
    "    public void testDivide() {\n" +
    "        int result = cut.divide(10, 2);\n" +
    "        assertEquals(5, result);\n" +
    "    }\n\n" +
    "    @Test(expected = ArithmeticException.class)\n" +
    "    public void testDivideByZero() {\n" +
    "        cut.divide(10, 0);\n" +
    "    }\n" +
    "}\n";
        ((JavascriptExecutor) driver).executeScript("arguments[0].CodeMirror.setValue(arguments[1]);", codeMirrorElement, code);       

        driver.findElement(By.id("coverageButton")).click();

        try {
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#console-textarea + div > * div.CodeMirror-code > *"), 1));
        } catch(TimeoutException e) {
            Assert.fail();
        }
    } 

    @Test
    public void submit() {
        String urlPaginaDiRedirezione = "http://localhost/editor";
        moveToEditor(urlPaginaDiRedirezione);

        WebDriverWait wait = new WebDriverWait(driver, timeout);

        try {
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#sidebar-textarea + div > * div.CodeMirror-code > *"), 1));
        } catch (TimeoutException e) {
            Assert.fail();
        }

        WebElement element = driver.findElement(By.cssSelector("span.cm-def"));

        // Scorrere l'elemento in vista
        JavascriptExecutor executor = (JavascriptExecutor) driver;
        executor.executeScript("arguments[0].scrollIntoView(true);", element);

        // Trova l'elemento CodeMirror
        WebElement codeMirrorElement = driver.findElement(By.cssSelector("#editor + div"));

            // Inserisci il tuo testo nell'editor CodeMirror
    String code = "import org.junit.Before;\n" +
    "import org.junit.After;\n" +
    "import org.junit.BeforeClass;\n" +
    "import org.junit.AfterClass;\n" +
    "import org.junit.Test;\n" +
    "import static org.junit.Assert.*;\n" +
    "\n" +
    "//scrivere al posto di \"TestClasse\" il nome della classe da testare\n" +
    "public class TestCalcolatrice {\n" +
    "    private static Calcolatrice cut;\n\n" +
    "    @BeforeClass\n" +
    "    public static void setup() {\n" +
    "        cut = new Calcolatrice();\n" +
    "    }\n\n" +
    "    @Test\n" +
    "    public void testDivide() {\n" +
    "        int result = cut.divide(10, 2);\n" +
    "        assertEquals(5, result);\n" +
    "    }\n\n" +
    "    @Test(expected = ArithmeticException.class)\n" +
    "    public void testDivideByZero() {\n" +
    "        cut.divide(10, 0);\n" +
    "    }\n" +
    "}\n";
        ((JavascriptExecutor) driver).executeScript("arguments[0].CodeMirror.setValue(arguments[1]);", codeMirrorElement, code);       

        driver.findElement(By.id("runButton")).click();

        try {
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#console-textarea2 + div > * div.CodeMirror-code > *"), 1));
        } catch (TimeoutException e) {
            Assert.fail();
        }
    }

    
    @Test
    public void storico() {
        String urlPaginaDiRedirezione = "http://localhost/editor";
        moveToEditor(urlPaginaDiRedirezione);

        WebDriverWait wait = new WebDriverWait(driver, timeout);

        try {
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#sidebar-textarea + div > * div.CodeMirror-code > *"), 1));
        } catch(TimeoutException e) {
            Assert.fail();
        }

        // Trova l'elemento CodeMirror
        WebElement codeMirrorElement = driver.findElement(By.cssSelector("#editor + div"));

            // Inserisci il tuo testo nell'editor CodeMirror
    String code = "import org.junit.Before;\n" +
    "import org.junit.After;\n" +
    "import org.junit.BeforeClass;\n" +
    "import org.junit.AfterClass;\n" +
    "import org.junit.Test;\n" +
    "import static org.junit.Assert.*;\n" +
    "\n" +
    "//scrivere al posto di \"TestClasse\" il nome della classe da testare\n" +
    "public class TestCalcolatrice {\n" +
    "    private static Calcolatrice cut;\n\n" +
    "    @BeforeClass\n" +
    "    public static void setup() {\n" +
    "        cut = new Calcolatrice();\n" +
    "    }\n\n" +
    "    @Test\n" +
    "    public void testDivide() {\n" +
    "        int result = cut.divide(10, 2);\n" +
    "        assertEquals(5, result);\n" +
    "    }\n\n" +
    "    @Test(expected = ArithmeticException.class)\n" +
    "    public void testDivideByZero() {\n" +
    "        cut.divide(10, 0);\n" +
    "    }\n" +
    "}\n";
        ((JavascriptExecutor) driver).executeScript("arguments[0].CodeMirror.setValue(arguments[1]);", codeMirrorElement, code);

        driver.findElement(By.id("runButton")).click();

        try {
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#console-textarea2 + div > * div.CodeMirror-code > *"), 1));
        } catch (TimeoutException e) {
            Assert.fail();
        }

        driver.findElement(By.id("storico")).click();

        try {
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#console-textarea + div > * div.CodeMirror-code > *"), 1));
        } catch(TimeoutException e) {
            Assert.fail();
        }
    } 

    @Test
    public void logout_editor() {
        String urlPaginaDiRedirezione = "http://localhost/editor";
        moveToEditor(urlPaginaDiRedirezione);

        WebDriverWait wait = new WebDriverWait(driver, timeout);

        try {
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#sidebar-textarea + div > * div.CodeMirror-code > *"), 1));
        } catch(TimeoutException e) {
            Assert.fail();
        }       

        driver.findElement(By.id("logout")).click();

        Alert alert = driver.switchTo().alert();
        alert.accept(); // clicco su conferma per effettuare il logout

        try {
            wait.until(ExpectedConditions.urlToBe("http://localhost/login"));
        } catch(TimeoutException e) {
            Assert.fail();
        }
    } 
    
}
