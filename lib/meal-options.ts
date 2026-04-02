import { MealOption } from './types';

export const BREAKFAST_OPTIONS: MealOption[] = [
  { key: 'millet-idli', slot: 'breakfast', label: '4-5 millet/red-rice idlis + 100ml coconut milk or peanut chutney + 1 tsp ghee + papaya + Greek yoghurt', combos: [1,2,3,4] },
  { key: 'foxtail-pongal', slot: 'breakfast', label: '100g foxtail millet pongal + 1 tsp ghee + pepper-cumin tempering + 1 boiled egg or 50g paneer', combos: [1,2,3,4] },
  { key: 'dalia-upma', slot: 'breakfast', label: '100g vegetable broken-wheat upma + 1 boiled egg or 50g tofu + 1 tbsp hummus', combos: [1,2,3,4] },
  { key: 'wholegrain-dosa', slot: 'breakfast', label: '2-3 wholegrain dosas (finger-millet/oats/amaranth) + 2 tbsp chutney + sautéed spinach or 50g paneer bhurji', combos: [1,2,3,4] },
  { key: 'overnight-oats', slot: 'breakfast', label: 'Overnight oats/amaranth porridge (100ml milk + 1 tsp chia + ½ tsp cinnamon + 1 tsp nut butter) + seasonal fruit + Greek yoghurt', combos: [1,2,3,4] },
  { key: 'sweet-potato-bowl', slot: 'breakfast', label: '100g sweet potato mash bowl + 1 egg omelette + 20g sautéed veggies + 1 tsp nut butter + cinnamon', combos: [1,2,3,4] },
  { key: 'wholegrain-wrap', slot: 'breakfast', label: '2 wholegrain wraps (chapati) + 2 scrambled eggs + 50g sautéed bell peppers + 1 tsp hummus + ½ orange or 3 dates', combos: [1,2,3,4] },
];

export const LUNCH_OPTIONS: MealOption[] = [
  { key: 'murunga-keerai-rice', slot: 'lunch', label: '100g murunga keerai rice + protein + 100g veggies + 200ml buttermilk', combos: [1,2,3,4] },
  { key: 'rice-dal', slot: 'lunch', label: '100g rice (70 white+30 rakthasaali) + dal/rajmah gravy + protein + 100g veggies + Greek yoghurt', combos: [1,2,3,4] },
  { key: 'chicken-fried-rice', slot: 'lunch', label: '150g chicken/beef fried rice (homemade) + choice veggies + 50g Greek yoghurt', combos: [1,2,3,4] },
  { key: 'vendhayam-rice', slot: 'lunch', label: '100g vendhayam red rice + protein gravy + 100g avial + Greek yoghurt', combos: [1,2,3,4] },
  { key: 'coconut-ellu-rice', slot: 'lunch', label: '100g coconut rice or ellu sadham + protein + 100g veggies + Greek yoghurt', combos: [1,2,3,4] },
  { key: 'foxtail-millet-rice', slot: 'lunch', label: '100g foxtail millet rice or pasi payaru rice + protein gravy + 100g veggies + 50g Greek yoghurt', combos: [1,2,3,4] },
  { key: 'kambu-rice', slot: 'lunch', label: '100g kambu rice or thathha payaru sadham or ulundhu sadham + protein + 100g veggies + 50g Epigamia Turbo', combos: [1,2,3,4] },
];

export const DINNER_OPTIONS: MealOption[] = [
  { key: 'khapli-dosa-gravy', slot: 'dinner', label: 'Khapli atta dosai 3 medium + choice of gravy 150g + 100g vegetables', combos: [1,2,3,4] },
  { key: 'sattu-dosa-gravy', slot: 'dinner', label: '2 sattu-based dosa or almond flaxseed roti + choice of gravy 150g + 100g vegetables', combos: [1,2,3,4] },
  { key: 'black-rice-bowl', slot: 'dinner', label: '100g black rice bowl + 100g chicken/beef + 100g vegetables + cucumber-tomato salad or mint chutney', combos: [1,2,3,4] },
  { key: 'red-rice-adai', slot: 'dinner', label: '2 red rice or kambu adai/pesarettu/egg dosa + gravy 150g + 100g vegetables/salad', combos: [1,2,3,4] },
  { key: 'barley-khichdi', slot: 'dinner', label: '100g barley khichdi + 100g tofu/paneer + vegetables + cucumber-tomato salad', combos: [1,2,3,4] },
  { key: 'bowls-wraps-chicken', slot: 'dinner', label: 'Bowl: 100g brown/black rice + 100g paneer/tofu gravy + 100g poached veggies with salad dressing', combos: [1,2,3,4] },
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
  { key: 'bhel-sprouts', slot: 'mid_morning', label: '100g homemade bhel with puffed rice + sprouts + veggies', combos: [1] },
  { key: 'makhana-yoghurt', slot: 'mid_morning', label: '1 katori makhana + 50g Greek yoghurt/SKYR', combos: [1] },
  { key: 'cucumber-chaat', slot: 'mid_morning', label: '100g cucumber chaat (diced cucumber + tomatoes + onion + lemon + mint)', combos: [1] },
  { key: 'boiled-sundal', slot: 'mid_morning', label: 'Boiled sundal varieties (chickpeas/green gram/black-eyed beans) 1 katori with Indian seasoning', combos: [1] },
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
