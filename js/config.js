export const WIDTH = 800;
export const HEIGHT = 700;
export const FPS = 60;
export const FINAL_LEVEL = 30;
export const MAX_LIVES = 100;
export const COLORS = {
  white:'#f0f0f5', black:'#080812', cyan:'#50dcff', yellow:'#ffdc46', gold:'#ffcd28', red:'#ff5050',
  orange:'#ff9632', green:'#5ae678', purple:'#aa5aff', grey:'#787d96', pink:'#ff3c78', silver:'#bebec8'
};
export const BOSS_LEVELS = {
  3:['octopus'],6:['boss'],9:['snake'],12:['octopus'],15:['boss'],18:['snake'],21:['octopus'],24:['boss'],27:['snake'],30:['octopus','boss','snake']
};
export const WEAPONS = {
  arrow:{name:'ARROW', cooldown:16, damage:.9, color:COLORS.yellow},
  gun:{name:'GUN', cooldown:11, damage:1.7, color:'#ffc83c'},
  laser:{name:'LASER', cooldown:0, damage:.75, color:COLORS.pink},
  bazooka:{name:'BAZOOKA', cooldown:50, damage:12, color:COLORS.orange},
  flamethrower:{name:'FLAMETHROWER', cooldown:5, damage:.65, color:'#ff6419'}
};
export const FLAMETHROWER_DAMAGE = .455;
export const GIFTS = {water:50,milk:90,cola:100,apple:120,banana:130,orange:140,sausage:150,pizza:200,cheese:210,nail:220,bread:250,wood:260,wrench:320,oil:350,cake:400,hammer:410,medal:500,silver_medal:360};
export const GIFT_WEIGHTS = {water:24,milk:20,cola:18,sausage:18,apple:16,banana:15,orange:14,pizza:14,cheese:10,bread:10,nail:9,wood:8,oil:7,cake:6,wrench:5,hammer:4,medal:3,silver_medal:3};
