Feature 1: Wad kur

curl -X POST http://localhost/tipkur-api \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"mode": "wad-kur", "jait": "Diengdoh"}'

  Feature 2: Bishar ka Sang

  1. Sang
  curl -X POST https://tynrai.in/.netlify/functions/tipkur-api \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
   -d '{"mode": "bishar-sang", "jait_a": "Nongkynrih", "jait_b": "Nongbri"}'

   2. Ym Sang
   curl -X POST https://tynrai.in/.netlify/functions/tipkur-api \
  -H "Authorization: Bearer tynrai_tk_krd_2836" \
  -H "Content-Type: application/json" \
  -d '{"mode": "bishar-sang", "jait_a": "Nongbsap Pyrtuh", "jait_b": "Mylliem Pyrtuh"}'

  3. Verify
  curl -X POST https://tynrai.in/.netlify/functions/tipkur-api \
  -H "Authorization: Bearer tynrai_tk_krd_2836" \
  -H "Content-Type: application/json" \
  -d '{"mode": "bishar-sang", "jait_a": "Nongkynrih", "jait_b": "Nongrum"}'