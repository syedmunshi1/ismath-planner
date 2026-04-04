import { MealOption } from './types';

export const BREAKFAST_OPTIONS: MealOption[] = [
  { key: 'millet-idli', slot: 'breakfast', label: '4-5 millet/red-rice idlis + 100ml coconut milk or peanut chutney + 1 tsp ghee + papaya + Greek yoghurt', combos: [1,2,3,4] },
  { key: 'foxtail-pongal', slot: 'breakfast', label: '100g foxtail millet pongal + 1 tsp ghee + pepper-cumin tempering + 1 boiled egg or 50g paneer', combos: [1,2,3,4] },
  { key: 'dalia-upma', slot: 'breakfast', label: '100g vegetable broken-wheat upma + 1 boiled egg or 50g tofu + 1 tbsp hummus', combos: [1,2,3,4] },
  { key: 'wholegrain-dosa', slot: 'breakfast', label: '2-3 wholegrain dosas (finger-millet/oats/amaranth) + 2 tbsp chutney + sautéed spinach or 50g paneer bhurji', combos: [1,2,3,4] },
  { key: 'overnight-oats', slot: 'breakfast', label: 'Overnight oats/amaranth porridge (100ml milk + 1 tsp chia + ½ tsp cinnamon + 1 tsp nut butter) + seasonal fruit + Greek yoghurt', combos: [1,2,3,4] },
  { key: 'sweet-potato-bowl', slot: 'breakfast', label: '100g sweet potato mash bowl + 1 egg omelette with sautéed spinach + 1 tsp nut butter + cinnamon', combos: [1,2,3,4] },
  { key: 'wholegrain-wrap', slot: 'breakfast', label: '2 wholegrain wraps (chapati) + 2 scrambled eggs + 50g sautéed bell peppers + 1 tsp hummus + ½ orange or 3 dates', combos: [1,2,3,4] },
];

export const LUNCH_OPTIONS: MealOption[] = [
  { key: 'murunga-keerai-rice', slot: 'lunch', label: '100g murunga keerai rice (rice cooked with drumstick leaves) + 100g fish curry (tilapia/sardines/pomfret in tomato-ginger gravy) + drumstick stir-fry or sautéed spinach + 200ml buttermilk', combos: [1,2,3,4] },
  { key: 'rice-dal', slot: 'lunch', label: '100g rice (70g white + 30g rakthasaali) + rajmah-tomato gravy + 60g soya chunks OR 2 boiled eggs + carrot-beetroot sabzi + Greek yoghurt', combos: [1,2,3,4] },
  { key: 'chicken-fried-rice', slot: 'lunch', label: '150g chicken breast fried rice (homemade, minimal oil) + stir-fried broccoli + carrot + bell peppers + 50g Greek yoghurt', combos: [1,2,3,4] },
  { key: 'vendhayam-rice', slot: 'lunch', label: '100g vendhayam red rice (fenugreek-infused) + 100g chicken OR mutton curry (simple spice base, no cream) + 100g avial (drumstick + carrot + raw banana + coconut) + Greek yoghurt', combos: [1,2,3,4] },
  { key: 'coconut-ellu-rice', slot: 'lunch', label: '100g coconut rice or ellu sadham (sesame rice) + 80g paneer tikka OR 120g tofu curry + bhindi stir-fry or cauliflower-cluster beans sabzi + Greek yoghurt', combos: [1,2,3,4] },
  { key: 'foxtail-millet-rice', slot: 'lunch', label: '100g foxtail millet rice or pasi payaru rice + 100g fish curry (mackerel/pomfret) OR chicken gravy + sautéed murunga keerai or spinach + 50g Greek yoghurt', combos: [1,2,3,4] },
  { key: 'kambu-rice', slot: 'lunch', label: '100g kambu rice or thathha payaru sadham or ulundhu sadham + 100g beef OR chicken gravy (simple tomato base) + drumstick sabzi or carrot-bean stir-fry + 50g Epigamia Turbo', combos: [1,2,3,4] },
];

export const DINNER_OPTIONS: MealOption[] = [
  { key: 'khapli-dosa-gravy', slot: 'dinner', label: '3 medium khapli atta dosas + chicken OR fish curry 150g (simple spice-tomato base, no cream) + sautéed spinach with garlic or broccoli stir-fry', combos: [1,2,3,4] },
  { key: 'sattu-dosa-gravy', slot: 'dinner', label: '2 sattu dosas or almond flaxseed rotis + egg curry 150g (2 eggs in onion-tomato gravy) OR soya chunks gravy + cauliflower-carrot sabzi or cluster beans stir-fry', combos: [1,2,3,4] },
  { key: 'black-rice-bowl', slot: 'dinner', label: '100g black rice bowl + 100g grilled chicken breast or beef strips + steamed broccoli + carrot + cucumber-tomato salad with mint chutney', combos: [1,2,3,4] },
  { key: 'red-rice-adai', slot: 'dinner', label: '2 red rice or kambu adai/pesarettu + 150g fish curry (sardines/pomfret) OR mutton gravy + murunga keerai thoran or drumstick sabzi', combos: [1,2,3,4] },
  { key: 'barley-khichdi', slot: 'dinner', label: '100g barley khichdi + 80g paneer tikka (oil-free) or tofu stir-fry + beetroot-carrot sabzi + cucumber-tomato salad', combos: [1,2,3,4] },
  { key: 'bowls-wraps-chicken', slot: 'dinner', label: 'Bowl: 100g brown/black rice + 100g grilled chicken OR paneer curry (no cream) + poached spinach or roasted drumstick + salad dressing', combos: [1,2,3,4] },
  { key: 'spleen-masala', slot: 'dinner', label: 'Mutton/goat spleen masala (75-100g) + khapli atta dosa 2 + sautéed spinach + mint chutney', combos: [1,2,3,4], tags: ['spleen'] },
  { key: 'spleen-stir-fry', slot: 'dinner', label: 'Spleen stir-fry with onions + ginger + garlic (75-100g) + kambu roti 2 + cucumber salad', combos: [1,2,3,4], tags: ['spleen'] },
];

export const PRE_SESSION_OPTIONS: MealOption[] = [
  { key: 'sathumaav-kanji', slot: 'pre_session', label: 'Sathumaav kanji 200ml + 1 red banana + 1 tsp peanut butter', combos: [2,4] },
  { key: 'watermelon-cashew', slot: 'pre_session', label: '200ml fresh watermelon juice + salt + banana & cashew mix (1 banana + 5-6 crushed cashews + salt)', combos: [2,4] },
  { key: 'pineapple-puffed', slot: 'pre_session', label: '200ml fresh pineapple juice + 1 cup puffed rice + 1.5 tbsp roasted peanuts + ½ tsp jaggery powder', combos: [2,4] },
  { key: 'watermelon-puffed', slot: 'pre_session', label: '200ml fresh watermelon juice + 1 cup puffed rice + 1.5 tbsp roasted peanuts + 1 chopped banana', combos: [2,4] },
  { key: 'multigrain-banana', slot: 'pre_session', label: '1 slice multigrain bread + peanut butter + ½ banana + 1 dried fig + 3 pistachios + ½ tsp honey + cinnamon + 100ml OJ with salt', combos: [2,4] },
  { key: 'dalia-porridge', slot: 'pre_session', label: '3 tbsp dalia porridge (rice flakes + almond milk + cardamom + honey + jaggery + raisins + pistachios)', combos: [2,4] },
];

export const ANTI_INFLAMMATORY_OPTIONS: MealOption[] = [
  { key: 'bhel-sprouts', slot: 'mid_morning', label: '100g homemade bhel with puffed rice + sprouted green gram + diced tomato + cucumber + onion + lime', combos: [1] },
  { key: 'makhana-yoghurt', slot: 'mid_morning', label: '1 katori makhana + 50g Greek yoghurt/SKYR', combos: [1] },
  { key: 'cucumber-chaat', slot: 'mid_morning', label: '100g cucumber chaat (diced cucumber + tomatoes + onion + lemon + mint)', combos: [1] },
  { key: 'boiled-sundal', slot: 'mid_morning', label: 'Boiled chickpeas or green gram 1 katori + fresh coconut + green chilli tempering + diced onion + lime squeeze', combos: [1] },
  { key: 'roasted-chickpeas', slot: 'mid_morning', label: '1 katori roasted chickpeas/edamame with choice of seasonings', combos: [1] },
  { key: 'avo-multigrain-snack', slot: 'mid_morning', label: '½ mashed avocado on multigrain/sourdough bread with seasonings', combos: [1] },
];

export const AVOCADO_OPTIONS: MealOption[] = [
  { key: 'avo-smoothie', slot: 'on_waking', label: '+½ avocado blended into waking smoothie', combos: [2,3] },
  { key: 'avo-toast', slot: 'breakfast', label: '+avocado toast: ½ mashed avo on multigrain + lime + chilli flakes', combos: [1,2,3,4] },
  { key: 'avo-guac-lunch', slot: 'lunch', label: '+guacamole (mashed avo + lime + salt + coriander) as dressing', combos: [1,2,3,4] },
  { key: 'avo-pre-session', slot: 'pre_session', label: '+½ mashed avocado on multigrain bread with salt + lime (add to pre-session)', combos: [2,4] },
  { key: 'avo-dinner-salad', slot: 'dinner', label: '+avocado-cucumber salad (diced avo + cucumber + tomato + lime + mint)', combos: [1,2,3,4] },
];

export const ALL_OPTIONS = [
  ...BREAKFAST_OPTIONS,
  ...LUNCH_OPTIONS,
  ...DINNER_OPTIONS,
  ...PRE_SESSION_OPTIONS,
  ...ANTI_INFLAMMATORY_OPTIONS,
  ...AVOCADO_OPTIONS,
];
