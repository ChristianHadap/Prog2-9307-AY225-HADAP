/**
 * DataRecord class represents a single game record from the CSV file
 */
public class DataRecord {
    private String img;
    private String title;
    private String console;
    private String genre;
    private String publisher;
    private String developer;
    private double criticScore;
    private double totalSales;
    private double naSales;
    private double jpSales;
    private double palSales;
    private double otherSales;
    private String releaseDate;
    private String lastUpdate;

    // Constructor
    public DataRecord(String img, String title, String console, String genre,
                      String publisher, String developer, String criticScore,
                      String totalSales, String naSales, String jpSales,
                      String palSales, String otherSales, String releaseDate,
                      String lastUpdate) {
        this.img = img;
        this.title = title;
        this.console = console;
        this.genre = genre;
        this.publisher = publisher;
        this.developer = developer;
        this.criticScore = criticScore.isEmpty() ? 0 : Double.parseDouble(criticScore);
        this.totalSales = totalSales.isEmpty() ? 0 : Double.parseDouble(totalSales);
        this.naSales = naSales.isEmpty() ? 0 : Double.parseDouble(naSales);
        this.jpSales = jpSales.isEmpty() ? 0 : Double.parseDouble(jpSales);
        this.palSales = palSales.isEmpty() ? 0 : Double.parseDouble(palSales);
        this.otherSales = otherSales.isEmpty() ? 0 : Double.parseDouble(otherSales);
        this.releaseDate = releaseDate;
        this.lastUpdate = lastUpdate;
    }

    // Getters
    public String getTitle() { return title; }
    public String getConsole() { return console; }
    public String getGenre() { return genre; }
    public String getPublisher() { return publisher; }
    public String getDeveloper() { return developer; }
    public double getCriticScore() { return criticScore; }
    public double getTotalSales() { return totalSales; }
    public double getNaSales() { return naSales; }
    public double getJpSales() { return jpSales; }
    public double getPalSales() { return palSales; }
    public double getOtherSales() { return otherSales; }
    public String getReleaseDate() { return releaseDate; }

    @Override
    public String toString() {
        return String.format("%s | %s | %s | %.2f sales | Score: %.1f",
                title, console, genre, totalSales, criticScore);
    }
}
