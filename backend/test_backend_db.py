from backend.db import db_service

def test_db():
    try:
        results = db_service.query("SELECT * FROM stock_prices LIMIT 5")
        print("Successfully queried stock_prices:")
        for row in results:
            print(row)
            
        journals = db_service.query("SELECT * FROM journal_entries LIMIT 5")
        print("\nSuccessfully queried journal_entries:")
        for row in journals:
            print(row)
            
        return True
    except Exception as e:
        print(f"DB Test Failed: {e}")
        return False

if __name__ == "__main__":
    test_db()
