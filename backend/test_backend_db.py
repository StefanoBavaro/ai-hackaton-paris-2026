from app.services.db import db_service


def test_db():
    try:
        results = db_service.query("SELECT * FROM stock_prices LIMIT 5")
        print("Successfully queried stock_prices:")
        for row in results:
            print(row)

        metrics = db_service.query("SELECT * FROM financial_metrics LIMIT 5")
        print("\nSuccessfully queried financial_metrics:")
        for row in metrics:
            print(row)

        news = db_service.query("SELECT * FROM news LIMIT 5")
        print("\nSuccessfully queried news:")
        for row in news:
            print(row)

        return True
    except Exception as e:
        print(f"DB Test Failed: {e}")
        return False


if __name__ == "__main__":
    test_db()
