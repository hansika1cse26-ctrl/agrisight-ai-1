// Farmer-friendly educational guidance. Confirm treatments with local experts.
export const guidance = {
  'Healthy': {
    description: 'This leaf looks healthy according to the trained image classifier. Keep monitoring the crop because one photo cannot confirm the health of the entire plant.',
    symptoms: ['Even green colour and a normal leaf shape.', 'No obvious brown spots, dark lesions, or spreading damage in the uploaded image.'],
    causes: ['Healthy growth is supported by suitable sunlight, watering, drainage, and balanced nutrients.'],
    treatment: ['No disease treatment is suggested for this result.', 'Continue regular care and inspect other leaves too.'],
    prevention: ['Water the soil rather than wetting leaves often.', 'Give plants good airflow and remove weeds.', 'Check plants regularly for new spots or wilting.'],
  },
  'Early Blight': {
    description: 'Early blight is a common fungal leaf disease of tomatoes. It often starts on older, lower leaves and can slowly reduce healthy foliage.',
    symptoms: ['Brown spots with ring-like patterns, similar to a target.', 'Yellowing around the spots.', 'Older leaves may dry out and drop.'],
    causes: ['The fungus Alternaria can spread through infected crop material and splashing water.', 'Warm conditions, leaf wetness, and poor airflow can favour infection.'],
    treatment: ['Remove badly affected leaves carefully and dispose of them away from the crop.', 'Avoid overhead watering and keep foliage dry where possible.', 'Ask a local agricultural adviser about a locally approved tomato fungicide if the disease is spreading; always follow its label.'],
    prevention: ['Rotate crops and clear infected plant debris after harvest.', 'Use mulch to reduce soil splash.', 'Space plants for airflow and check lower leaves weekly.'],
  },
  'Late Blight': {
    description: 'Late blight is a serious tomato disease that can spread quickly in cool, damp weather. It needs prompt attention.',
    symptoms: ['Large, irregular, water-soaked or dark brown leaf patches.', 'Leaves may collapse quickly.', 'White fuzzy growth can sometimes appear on leaf undersides in humid weather.'],
    causes: ['The pathogen Phytophthora infestans can spread by wind-borne spores and infected plants.', 'Cool, wet or very humid conditions help it spread.'],
    treatment: ['Keep affected plants separate from healthy ones where possible and avoid handling wet foliage.', 'Contact a local agricultural extension worker promptly for confirmation and area-specific management.', 'Remove severely infected material according to local guidance; use only locally approved products and their label directions.'],
    prevention: ['Inspect crops frequently during humid or rainy weather.', 'Avoid overhead irrigation and improve airflow.', 'Start with healthy seedlings and watch for local late-blight alerts.'],
  },
};
