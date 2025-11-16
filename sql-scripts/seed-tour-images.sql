-- Seed tour images với sample Cloudinary/Unsplash URLs
-- Run this after init-databases.sql

-- Clear existing images (optional)
-- DELETE FROM tour_images;

-- Insert sample images for existing tours
-- Using Vietnamese tourism images from Unsplash

-- Tour 1: Hà Nội - Hạ Long (if exists)
INSERT INTO tour_images (tour_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', true),
(1, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80', false),
(1, 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80', false)
ON CONFLICT DO NOTHING;

-- Tour 2: Sài Gòn - Mekong Delta (if exists)
INSERT INTO tour_images (tour_id, image_url, is_primary) VALUES
(2, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80', true),
(2, 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80', false)
ON CONFLICT DO NOTHING;

-- Tour 3: Đà Nẵng - Hội An (if exists)
INSERT INTO tour_images (tour_id, image_url, is_primary) VALUES
(3, 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80', true),
(3, 'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&w=1200&q=80', false)
ON CONFLICT DO NOTHING;

-- Tour 4: Nha Trang Beach (if exists)
INSERT INTO tour_images (tour_id, image_url, is_primary) VALUES
(4, 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80', true),
(4, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', false)
ON CONFLICT DO NOTHING;

-- Tour 5: Phú Quốc Island (if exists)
INSERT INTO tour_images (tour_id, image_url, is_primary) VALUES
(5, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', true),
(5, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', false)
ON CONFLICT DO NOTHING;

-- Verify
SELECT t.tour_name, ti.image_url, ti.is_primary
FROM tour_images ti
JOIN tours t ON t.tour_id = ti.tour_id
ORDER BY ti.tour_id, ti.is_primary DESC;
