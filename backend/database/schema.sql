-- ============================================================================
-- AgroCredit AI - SQLite Database Schema
-- Система автоматического кредитного скоринга аграрных заемщиков
-- ============================================================================

-- Включение поддержки внешних ключей
PRAGMA foreign_keys = ON;

-- ============================================================================
-- Таблица 1: FARMERS (Фермеры)
-- Основная таблица с информацией о фермерах
-- ============================================================================
CREATE TABLE IF NOT EXISTS farmers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id TEXT UNIQUE NOT NULL,
    age INTEGER NOT NULL CHECK(age >= 18 AND age <= 100),
    education_level TEXT NOT NULL CHECK(education_level IN ('начальное', 'среднее', 'высшее', 'специальное')),
    farming_experience_years INTEGER NOT NULL CHECK(farming_experience_years >= 0),
    number_of_loans INTEGER DEFAULT 0 CHECK(number_of_loans >= 0),
    past_defaults INTEGER DEFAULT 0 CHECK(past_defaults >= 0),
    repayment_score INTEGER DEFAULT 0 CHECK(repayment_score >= 0 AND repayment_score <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по farmer_id
CREATE INDEX IF NOT EXISTS idx_farmers_farmer_id ON farmers(farmer_id);

-- ============================================================================
-- Таблица 2: FARMS (Фермерские хозяйства)
-- Информация о земельных участках и фермах
-- ============================================================================
CREATE TABLE IF NOT EXISTS farms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,
    farm_size_acres REAL NOT NULL CHECK(farm_size_acres > 0),
    ownership_status TEXT NOT NULL CHECK(ownership_status IN ('собственность', 'аренда', 'совладение')),
    land_valuation_usd REAL CHECK(land_valuation_usd >= 0),
    soil_quality_index INTEGER CHECK(soil_quality_index >= 0 AND soil_quality_index <= 100),
    water_availability_score INTEGER CHECK(water_availability_score >= 0 AND water_availability_score <= 100),
    irrigation_type TEXT CHECK(irrigation_type IN ('капельное', 'дождевание', 'поверхностное', 'отсутствует')),
    crop_rotation_history_years INTEGER DEFAULT 0 CHECK(crop_rotation_history_years >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- Индекс для связи с фермерами
CREATE INDEX IF NOT EXISTS idx_farms_farmer_id ON farms(farmer_id);

-- ============================================================================
-- Таблица 3: CROPS (Сельскохозяйственные культуры)
-- Информация о выращиваемых культурах и урожайности
-- ============================================================================
CREATE TABLE IF NOT EXISTS crops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER NOT NULL,
    crop_type TEXT NOT NULL,
    crop_yield_last_5_years_tonnes TEXT, -- JSON массив: [2019, 2020, 2021, 2022, 2023]
    yield_variance_index REAL CHECK(yield_variance_index >= 0),
    expected_yield_next_season REAL CHECK(expected_yield_next_season >= 0),
    market_price_volatility_score REAL CHECK(market_price_volatility_score >= 0),
    use_of_certified_seeds INTEGER DEFAULT 0 CHECK(use_of_certified_seeds IN (0, 1)), -- BOOLEAN
    use_of_fertilizers INTEGER DEFAULT 0 CHECK(use_of_fertilizers IN (0, 1)), -- BOOLEAN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- Индекс для связи с фермами
CREATE INDEX IF NOT EXISTS idx_crops_farm_id ON crops(farm_id);
CREATE INDEX IF NOT EXISTS idx_crops_crop_type ON crops(crop_type);

-- ============================================================================
-- Таблица 4: MACHINERY (Сельскохозяйственная техника)
-- Информация о технике и оборудовании
-- ============================================================================
CREATE TABLE IF NOT EXISTS machinery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    model TEXT,
    build_years INTEGER CHECK(build_years >= 1950 AND build_years <= 2030),
    condition TEXT CHECK(condition IN ('отличное', 'хорошее', 'удовлетворительное', 'требует ремонта')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- Индекс для связи с фермами
CREATE INDEX IF NOT EXISTS idx_machinery_farm_id ON machinery(farm_id);

-- ============================================================================
-- Таблица 5: OBJECTS (Объекты недвижимости)
-- Информация о зданиях и сооружениях на ферме
-- ============================================================================
CREATE TABLE IF NOT EXISTS objects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER NOT NULL,
    area REAL CHECK(area > 0),
    type TEXT NOT NULL CHECK(type IN ('склад', 'ангар', 'жилой дом', 'производственное помещение', 'другое')),
    legal_status TEXT CHECK(legal_status IN ('зарегистрировано', 'не зарегистрировано', 'в процессе оформления')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- Индекс для связи с фермами
CREATE INDEX IF NOT EXISTS idx_objects_farm_id ON objects(farm_id);

-- ============================================================================
-- Таблица 6: GEOMETRY (Геометрические данные участков)
-- Информация о геометрии земельных участков
-- ============================================================================
CREATE TABLE IF NOT EXISTS geometry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER NOT NULL,
    vertices INTEGER CHECK(vertices >= 3),
    polygon_quality TEXT CHECK(polygon_quality IN ('высокое', 'среднее', 'низкое')),
    coordinates TEXT, -- JSON массив координат полигона
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- Индекс для связи с фермами
CREATE INDEX IF NOT EXISTS idx_geometry_farm_id ON geometry(farm_id);

-- ============================================================================
-- Таблица 7: MARKET_ACCESS (Доступ к рынкам)
-- Информация о доступе к рынкам сбыта и инфраструктуре
-- ============================================================================
CREATE TABLE IF NOT EXISTS market_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER NOT NULL,
    distance_to_market_km REAL CHECK(distance_to_market_km >= 0),
    availability_of_storage_facilities INTEGER DEFAULT 0 CHECK(availability_of_storage_facilities IN (0, 1)), -- BOOLEAN
    access_to_contract_farming INTEGER DEFAULT 0 CHECK(access_to_contract_farming IN (0, 1)), -- BOOLEAN
    supply_chain_linkages_score INTEGER CHECK(supply_chain_linkages_score >= 0 AND supply_chain_linkages_score <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- Индекс для связи с фермами
CREATE INDEX IF NOT EXISTS idx_market_access_farm_id ON market_access(farm_id);

-- ============================================================================
-- Таблица 8: TECHNOLOGY_USAGE (Использование технологий)
-- Информация об использовании современных технологий на ферме
-- ============================================================================
CREATE TABLE IF NOT EXISTS technology_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER NOT NULL,
    mechanization_level TEXT CHECK(mechanization_level IN ('высокий', 'средний', 'низкий', 'отсутствует')),
    precision_agri_tools_used INTEGER DEFAULT 0 CHECK(precision_agri_tools_used IN (0, 1)), -- BOOLEAN
    use_of_financial_software INTEGER DEFAULT 0 CHECK(use_of_financial_software IN (0, 1)), -- BOOLEAN
    use_of_drones_or_satellite_data INTEGER DEFAULT 0 CHECK(use_of_drones_or_satellite_data IN (0, 1)), -- BOOLEAN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- Индекс для связи с фермами
CREATE INDEX IF NOT EXISTS idx_technology_usage_farm_id ON technology_usage(farm_id);

-- ============================================================================
-- Таблица 9: INSURANCE_AND_RISK_MITIGATION (Страхование и управление рисками)
-- Информация о страховании урожая и управлении рисками
-- ============================================================================
CREATE TABLE IF NOT EXISTS insurance_and_risk_mitigation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER NOT NULL,
    crop_insurance_coverage INTEGER DEFAULT 0 CHECK(crop_insurance_coverage IN (0, 1)), -- BOOLEAN
    insurance_sum_assured REAL DEFAULT 0 CHECK(insurance_sum_assured >= 0),
    past_claim_history INTEGER DEFAULT 0 CHECK(past_claim_history >= 0),
    weather_index_insurance INTEGER DEFAULT 0 CHECK(weather_index_insurance IN (0, 1)), -- BOOLEAN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- Индекс для связи с фермами
CREATE INDEX IF NOT EXISTS idx_insurance_farm_id ON insurance_and_risk_mitigation(farm_id);

-- ============================================================================
-- Таблица 10: LOAN_REQUESTS (Заявки на кредиты)
-- Информация о кредитных заявках
-- ============================================================================
CREATE TABLE IF NOT EXISTS loan_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER NOT NULL,
    loan_purpose TEXT NOT NULL,
    requested_loan_amount REAL NOT NULL CHECK(requested_loan_amount > 0),
    loan_term_months INTEGER CHECK(loan_term_months > 0 AND loan_term_months <= 360), -- Срок кредита (макс 30 лет)
    expected_cash_flow_after_loan REAL,
    repayment_capacity_score INTEGER CHECK(repayment_capacity_score >= 0 AND repayment_capacity_score <= 100),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'in_review')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- Индекс для связи с фермами
CREATE INDEX IF NOT EXISTS idx_loan_requests_farm_id ON loan_requests(farm_id);
CREATE INDEX IF NOT EXISTS idx_loan_requests_status ON loan_requests(status);

-- ============================================================================
-- Таблица 11: SCORING_RESULTS (Результаты скоринга)
-- Хранение результатов кредитного скоринга для каждого фермера
-- ============================================================================
CREATE TABLE IF NOT EXISTS scoring_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,
    farm_id INTEGER NOT NULL,
    land_score INTEGER DEFAULT 0,
    tech_score INTEGER DEFAULT 0,
    crop_score INTEGER DEFAULT 0,
    ban_score INTEGER DEFAULT 0,
    infra_score INTEGER DEFAULT 0,
    geo_score INTEGER DEFAULT 0,
    diversification_score INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0 CHECK(total_score >= 0 AND total_score <= 100),
    interest_rate REAL DEFAULT 0.20,
    monthly_payment REAL DEFAULT 0, -- Ежемесячный платеж
    debt_to_income_ratio REAL DEFAULT 0, -- Отношение долга к доходу
    gpt_analysis TEXT, -- Анализ от GPT
    gpt_recommendations TEXT, -- Рекомендации от GPT
    scoring_data_json TEXT, -- Полный JSON использованный для расчета
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_latest INTEGER DEFAULT 1 CHECK(is_latest IN (0, 1)), -- Флаг последнего расчета
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- Индексы для scoring_results
CREATE INDEX IF NOT EXISTS idx_scoring_farmer_id ON scoring_results(farmer_id);
CREATE INDEX IF NOT EXISTS idx_scoring_farm_id ON scoring_results(farm_id);
CREATE INDEX IF NOT EXISTS idx_scoring_latest ON scoring_results(is_latest);

-- ============================================================================
-- Таблица 12: SCORING_HISTORY (История изменений скоринга)
-- Отслеживание изменений скоринга во времени
-- ============================================================================
CREATE TABLE IF NOT EXISTS scoring_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scoring_result_id INTEGER NOT NULL,
    farmer_id INTEGER NOT NULL,
    total_score INTEGER,
    interest_rate REAL,
    change_reason TEXT, -- Причина пересчета
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scoring_result_id) REFERENCES scoring_results(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- Индекс для scoring_history
CREATE INDEX IF NOT EXISTS idx_history_farmer_id ON scoring_history(farmer_id);
CREATE INDEX IF NOT EXISTS idx_history_calculated ON scoring_history(calculated_at);

-- ============================================================================
-- Триггеры для автоматического обновления updated_at
-- ============================================================================

CREATE TRIGGER IF NOT EXISTS update_farmers_timestamp 
AFTER UPDATE ON farmers
BEGIN
    UPDATE farmers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_farms_timestamp 
AFTER UPDATE ON farms
BEGIN
    UPDATE farms SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_crops_timestamp 
AFTER UPDATE ON crops
BEGIN
    UPDATE crops SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_machinery_timestamp 
AFTER UPDATE ON machinery
BEGIN
    UPDATE machinery SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_objects_timestamp 
AFTER UPDATE ON objects
BEGIN
    UPDATE objects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_geometry_timestamp 
AFTER UPDATE ON geometry
BEGIN
    UPDATE geometry SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_market_access_timestamp 
AFTER UPDATE ON market_access
BEGIN
    UPDATE market_access SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_technology_usage_timestamp 
AFTER UPDATE ON technology_usage
BEGIN
    UPDATE technology_usage SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_insurance_timestamp 
AFTER UPDATE ON insurance_and_risk_mitigation
BEGIN
    UPDATE insurance_and_risk_mitigation SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_loan_requests_timestamp 
AFTER UPDATE ON loan_requests
BEGIN
    UPDATE loan_requests SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
