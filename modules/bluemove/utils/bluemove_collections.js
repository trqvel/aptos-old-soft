const collectionUrls = [
    "/collection/Psycho-Hares Society-7a6d55",
    "/collection/Aptos-Street Bears-3e8e78",
    "/collection/LOS-VISITANTES 2-79c8fc",
    "/collection/Souffl3-BakeOff - Egg-a16033",
    "/collection/World-Cup 2022-6d05f4",
    "/collection/move-boards",
    "/collection/datablaze-starter-pack",
    "/collection/suiblock-pass",
    "/collection/abel-lions",
    "/collection/sui-degen-pass",
    "/collection/arkle",
    "/collection/ghost-xox",
    "/collection/sui-bunnies-mint-pass",
    "/collection/2phobos",
    "/collection/og-gatorz-eggz",
    "/collection/sherlock",
    "/collection/shrimp-companions",
    "/collection/digital-robots",
    "/collection/metapixel-early-adopter-nft",
    "/collection/the-habitats",
    "/collection/suipunksclub-og-pass",
    "/collection/boneshaman-totems-gen-0",
    "/collection/Aikuji",
    "/collection/hominids-fan-pass",
    "/collection/just-survive",
    "/collection/digital-game-gen1",
    "/collection/sherlock-mint-pass",
    "/collection/suigoats-mint-pass",
    "/collection/foxy-paws",
    "/collection/immutable-legends",
    "/collection/babyapessociety",
    "/collection/aptos-gods-gen-0",
    "/collection/aptos-plainum-gen-0",
    "/collection/aptos-pirates",
    "/collection/wagmi-whales",
    "/collection/digital-game-gen0",
    "/collection/apstation",
    "/collection/aptos-geckos",
    "/collection/deus-ex-machina",
    "/collection/sw33t-friends",
    "/collection/alpaca-inu",
    "/collection/foxiverse",
    "/collection/furpeeps",
    "/collection/hypers-gen1",
    "/collection/the-wave-of-kong",
    "/collection/dinos-wl-ticket-t1",
    "/collection/dinos-og-ticket-t2",
    "/collection/boys-adventure",
    "/collection/SUIHEROES",
    "/collection/aptorobos",
    "/collection/420StonedTrolls",
    "/collection/aptos-creature",
    "/collection/dinosui-pass",
    "/collection/the-garage-hustler",
    "/collection/occult-artefacts",
    "/collection/waaah-cats",
    "/collection/kreachers-insilva",
    "/collection/pontem-dark-ages",
    "/collection/test-tube",
    "/collection/aptos-robi",
    "/collection/aptos-art-museum",
    "/collection/aptosgenz",
    "/collection/aptos-cats",
    "/collection/elf-punk",
    "/collection/galxe-oat",
    "/collection/the-3d-infant",
    "/collection/laikas",
    "/collection/lemur_lounge",
    "/collection/nine-tails-nft",
    "/collection/aptos-santa-claus",
    "/collection/apstation-pass",
    "/collection/okita",
    "/collection/springers",
    "/collection/aptos-power-man",
    "/collection/degen-war-crow",
    "/collection/mavrik",
    "/collection/circle-pass",
    "/collection/aptos-cerise",
    "/collection/aptos-land-genesis",
    "/collection/koizumi",
    "/collection/aptos-dragons",
    "/collection/aptos-lions-club",
    "/collection/aptos-alpha-alpacas",
    "/collection/guess-the-dip",
    "/collection/puking-bee-club",
    "/collection/skellies-lab-nft",
    "/collection/live-bait",
    "/collection/goat-squad-nft",
    "/collection/move-name-service-v1",
    "/collection/monaki",
    "/collection/spooks",
    "/collection/turtles",
    "/collection/aptos-kids",
    "/collection/nothing",
    "/collection/aptos-cat-gang",
    "/collection/aptos-bearables",
    "/collection/piggy-cyborgs",
    "/collection/tigers-aptos-club",
    "/collection/dope-deerz",
    "/collection/meta-candy-pigs",
    "/collection/shikoku-四国区",
    "/collection/world-cup-2022",
    "/collection/aptos-rats",
    "/collection/aptos-human-club",
    "/collection/the-aptonians",
    "/collection/aptos-flip",
    "/collection/Aptos-Undead",
    "/collection/cosmic-crocs",
    "/collection/alpha-moves",
    "/collection/aptos-punks",
    "/collection/dino-fatties",
    "/collection/thing",
    "/collection/aptos-lands",
    "/collection/bruh-bears",
    "/collection/into-the-chibverse",
    "/collection/thugbullz",
    "/collection/p-gang",
    "/collection/facadenft",
    "/collection/arcana-eggs",
    "/collection/melted-sapien",
    "/collection/Pontem-Space-Pirates",
    "/collection/nevermores",
    "/collection/vampies",
    "/collection/cute-elf",
    "/collection/moon-otters",
    "/collection/aptos-glitch-labs",
    "/collection/the-things",
    "/collection/AptosBulls",
    "/collection/spooky-show",
    "/collection/world-wide-crazy",
    "/collection/Apetos-Apes",
    "/collection/halloweenboi",
    "/collection/polkabridge",
    "/collection/unicornses",
    "/collection/genesis-vampires",
    "/collection/nuigurumi",
    "/collection/f1dog",
    "/collection/taisho-labs",
    "/collection/aptos-coinflip",
    "/collection/aptos-monkeys",
    "/collection/aptos-ant-club",
    "/collection/aptos-koalas-army",
    "/collection/aptos-wizards",
    "/collection/retro-boys-club",
    "/collection/aptos-vampires",
    "/collection/Aptos-Toad-Overload",
    "/collection/Aptomingos",
    "/collection/bigfoot-town",
    "/collection/alpha-sheep",
    "/collection/aptos-names-v1"
];

const creatorAddresses = {
    "/collection/Psycho-Hares Society-7a6d55": '0xa673b5ad978bbc3ed26cf62be699fc99613e248684b6cda7aa7ef1669d5346d',
    "/collection/Aptos-Street Bears-3e8e78": '0xc5de2470e26002e82f6f1f504bd063fdbfc8bf8448c2db7434b36a6062fc82d9',
    "/collection/LOS-VISITANTES 2-79c8fc": '0x666a9c3ea25080cea114021f33d9244bff72c09baa7a30f5c42e576ab630b3e8',
    "/collection/Souffl3-BakeOff - Egg-a16033": '0x6b6228a95251e3c54fec68f591012bf928ae76b5ad99602af2ef5cd399d3c69f',
    "/collection/World-Cup 2022-6d05f4": '0xd2270eeeffdaa051e5f57df0752aedb74c3fecca03016dfb6123beea08472a4a',
    "/collection/move-boards": '0xb480e47e99b2035aa0337cb5143538d89b459271b5ef34a76b51afdc39860cf8',
    "/collection/datablaze-starter-pack": '0x10cc073330fc3f2c48acb83e974cf72ebb52f96b5004c9ce449d6785047137da',
    "/collection/suiblock-pass": '0xdb452606b6ffc7d52cb39f69389c3aa77994944604c7fa2359875b33c4c6fa4a',
    "/collection/abel-lions": '0x4f6015e8ec18955fb179967ea328ba54546f8be40438031c6dd0bfda25231f4a',
    "/collection/sui-degen-pass": '0xaab8fe50b32c2fb0eceae2ce722a33b967bce3b9b285ac10dffaacff8da177ed',
    "/collection/arkle": '0x134d5ddae326408d6555cc4149a59dca4d6471cdba0b28becb536621be509e62',
    "/collection/ghost-xox": '0x3ee11d0537c959d0f3063a8ed8ac8b3ba42ca87b7dfcf6060018418223ab6d9c',
    "/collection/sui-bunnies-mint-pass": '0xcfdd08598cb8dfce779798aa2a1b844a3cb6c1fe33d216107e3c11750d765ab6',
    "/collection/2phobos": '0xcf3297503b35abcb29a246a54471a692d955b68e7bd02b194452b85d1d571370',
    "/collection/og-gatorz-eggz": '0xec6ee8802c776750e01ffcefc066309303d7564db207e316e1b9edf64340296a',
    "/collection/sherlock": '0x9b834501dd186deffc086b4dbf3b9d73b95200b4c1577642135299d98c6c5441',
    "/collection/shrimp-companions": '0x4ddc4cb4b74d7f173ccfd49edb4e287f8ff0f00cc95b28a5cb40da7b8e96d026',
    "/collection/digital-robots": '0xc5abf3034b5baa188dfafdb0b2e603f57351c7995d58c296214fa0b09e1e9655',
    "/collection/metapixel-early-adopter-nft": '0x2a172fb8070cffff422e0bb2a460beaf367151348fe4a66aca397977a15bcdb4',
    "/collection/the-habitats": '0xf2b28e4b1dc1e809bc5da0a65ee2978616681922003e5be3fcecbf369c5ed7f8',
    "/collection/suipunksclub-og-pass": '0x5c1b1405e9511e42aed08d6138a850d9ddde46d5ba021f8e85de0fb51b6a16b2',
    "/collection/boneshaman-totems-gen-0": '0x78d9842e5c83babb6be19aa5e089402174fe73dc748455650d0b1a34a71f8d16',
    "/collection/Aikuji": '0x2bbfd3f469857eb39770ad38b596c1914a2d77429c479bccd60b5037bc331bfb',
    "/collection/hominids-fan-pass": '0xf7a5b710b4799a419a6d564e2f6fe146e13b533394c1fc079ea4acf202756a4',
    "/collection/just-survive": '0x2ad1a0e2935c3e22901980a126aae2f19afd20d1ffa5ed69e396460a41bd83d0',
    "/collection/digital-game-gen1": '0x7c2e87e0c2fe332d836e5ecbb2a5812bb95f2efd3c59bf43642a2759b6e68973',
    "/collection/sherlock-mint-pass": '0x83010598965a4e22f9a73cf916781fd81b2eb84a7a4725def7e133ae6408dde6',
    "/collection/suigoats-mint-pass": '0xaa5f1db2187f15b4102de694123e7f7e08caf7b23c6fa5affa38b1991952d666',
    "/collection/foxy-paws": '0x9932c5ee6ecebe202d67aff68e3c10ed8bea4ac4835dfd37116f012e3cfd7dc5',
    "/collection/immutable-legends": '0x8869f49c4a9fd52eb5eb77da82da2a70cf098ce63010e515e610c0da7593419e',
    "/collection/babyapessociety": '0xebc8c86a14d0ecf8bf746fc665e8d8bb620b783d8990e050c6a6163273c05936',
    "/collection/aptos-gods-gen-0": '0x212c715e0b8b72286f5b24731243cf46af5bb0dadeac39937f1ccd310307e8a0',
    "/collection/aptos-plainum-gen-0": '0x3b3a4a8c03a152edd52e56766ea7ae4f7bcd38f4cac79aa4bb3979ae4a78aa1e',
    "/collection/aptos-pirates": '0x7f04e519793b548b9318c1ca59a3b72166a8042ae42f1f0a4db4620f6c5509d4',
    "/collection/wagmi-whales": '0x75e508eab148774118186a3a82ddda77dc3cb4c80d7142f86b9466ccf0292bfd',
    "/collection/digital-game-gen0": '0x1c9607a2eaaf80a0ccf9d8e52a5191650944470c9eae6ba7b1c3d1f3309807ed',
    "/collection/apstation": '0x7a5c2c740cb20d65df853e475a5c73a0ad36a08123ecd9d0a12f47538d7b0490',
    "/collection/aptos-geckos": '0x6f4afad91a4ec8b0d9f9702aa8d4a98289c1f4d580e0e593fd1a4c582a61915',
    "/collection/deus-ex-machina": '0x92c2e920025b69e0719b05e41734c5faaadd1d71c90f403ae779b81890006c1e',
    "/collection/sw33t-friends": '0x92a99e9c1f1801e619f9f1b9f5de4a86b70052be8184382e65e11d34cf4e4593',
    "/collection/alpaca-inu": '0x427d19a25e6a21812144d171f1f672e6e1eaf5b609cb284a5a8b93c38c4f50fd',
    "/collection/foxiverse": '0x96d4e5c4bf3411d1cff701336748231522578c08dad4865fc71f178e0b7ca9c0',
    "/collection/furpeeps": '0x5293317109312c5c7966a14367e769b33b9f5e28b5f7253885f82d352208945d',
    "/collection/hypers-gen1": '0x85fb9cee30c48dff262f28e1a6bed78b85c182838fbadc549013dadffa723867',
    "/collection/the-wave-of-kong": '0x43324265473a6b4d0b6375c2f1a8ac06379d62c09282f5684cb343a021522af6',
    "/collection/dinos-wl-ticket-t1": '0x25c8221cd579895caea0b3888773e891339a2125e7d2ade56f5188389356c5cb',
    "/collection/dinos-og-ticket-t2": '0x2ba6734d3526042d28be554c17bd7d7b6b6c60d81540ea9acb1189a9372dbb98',
    "/collection/boys-adventure": '0x7945deffba107f34c25097ad4ed113ba93f6c1d2ace36ba364dd1ff0cfb498e',
    "/collection/SUIHEROES": '0xb68f909335b865ee98f78f4ccc9181acaa14179a8fe42e3c2849a5d04b664343',
    "/collection/aptorobos": '0xb8a68933cfcf7a56fa7330458f82609aeadc38a4fdf233529a26d18119796ad4',
    "/collection/420StonedTrolls": '0xf57633ccb4a31485159de62335b37cf4bba69f3215e3f8cfa5dbce6026556e22',
    "/collection/aptos-creature": '0xd8ea75495989faaa1520b021709c4569269645c32768c873a5b55243e095f228',
    "/collection/dinosui-pass": '0xf69b74562e2c58639f0025904eaff1df3f8b54bf16d6e0f4b6ea695665dd558d',
    "/collection/the-garage-hustler": '0xde83569a7ec44edb6b3326ba176fe8573e4d0b1e89d4217c071f943994011962',
    "/collection/occult-artefacts": '0x9ade2acda22efeed77a26b2df56d0b4189f6cd5355fdde6363a21f2b4054f5e9',
    "/collection/waaah-cats": '0x9b6595b1caaee9ed135ca4f2d120710f40103c0b401055108ec397b0de97128e',
    "/collection/kreachers-insilva": '0x2517a3e9209c79c9078c76d07f6e440c5e03ea276f3c8b8e62892f33c4cef01e',
    "/collection/pontem-dark-ages": '0x7fef9d50cd1a2ee2068617b086b98ec434f1728d7cadcc7088c402df4585ce41',
    "/collection/test-tube": '0x35080cd2eaec813e115e08c7ced97e4087949173239c140dbc9251e9655b690f',
    "/collection/aptos-robi": '0xb6bf5bba39dc3888791a01c0803597c9265c54858352de18ea41488e0893b5a3',
    "/collection/aptos-art-museum": '0x3d54b1191d173d829c8ab1b47a4d14bdef1b40d181fa3d35da36769b5e14701f',
    "/collection/aptosgenz": '0xc2eec7fde5c2365d9c1d9fdcbd11ed687380fb3de8d2f68a7a4161f43c04819f',
    "/collection/aptos-cats": '0x216fa04f983419d2edd747d918b8125c66a49ed2bfb64c62e803a49114f71725',
    "/collection/elf-punk": '0x8b09d28aed37163aef9e840b4a955fca7b22e6f0bf8bcb9c5947dbfc33fd2013',
    "/collection/galxe-oat": '0x92d2f7ad00630e4dfffcca01bee12c84edf004720347fb1fd57016d2cc8d3f8',
    "/collection/the-3d-infant": '0x1d9d10e92e43710a2c1ec6edf196ec5e457853400224bf7d732d1b8e4910df70',
    "/collection/laikas": '0xed3a0a9f2074a72c03e594bbf7bffbb10920f4ceedf67f0ca2562d9f9d0a7b76',
    "/collection/lemur_lounge": '0x213b33fb8ee76400966e82214c5cebb3b77c7aa8b1db28e69bccc7a65eb0627c',
    "/collection/nine-tails-nft": '0xd0949fc91dadc95af45f3af2fb93fa2500f8b5de6674bab2747cf9bba56eb962',
    "/collection/aptos-santa-claus": '0xf371858b8e24e863a156dfd788a20f772688844c0c1720c041605cb850e73679',
    "/collection/apstation-pass": '0x6b4f89598b076f6e668a3cada80493735290a77bb28c2e9d92ebe3e163ca9f15',
    "/collection/okita": '0xbbc37071ec898d94b2fe22dfe26ad55b271e5c29f662b6fbf1bbac096df141e2',
    "/collection/springers": '0xe1804bd852af653b7388ae0f72637c492c5423d69cf5c787669396fe323e6b93',
    "/collection/aptos-power-man": '0x74d9b386519de0fe9044cfa0da5faf92a38619e2ac85b375cad89f0f92cee1b5',
    "/collection/degen-war-crow": '0x50f2f62045d9dcc2acc9c9b084f7e0d537cc0af70c7194a5a63b6c266772417f',
    "/collection/mavrik": '0xf3778cf4d8b6d61ab3d79c804797ef7417e258449d2735b0f405e604b81f7916',
    "/collection/circle-pass": '0x24d2394d0fcbd93639c5932de14c778bd78d6bddde1dbb525dc7e7f83ab18456',
    "/collection/aptos-cerise": '0x82ea66a23147e64a9801c7b4e6056da93ea6f91ae13e092b47873c5713aca5fb',
    "/collection/aptos-land-genesis": '0x81c000b05294454d651da56c1638c00632b108baaf30965c8e0a0931a47239c',
    "/collection/koizumi": '0xb5a968bb15d0a99e33161712b562e4a01131364996a435df69aa7d964dc0ae11',
    "/collection/aptos-dragons": '0x5ca9e4b28047b1a7b2b2bde6921534fd9705817f2da4e4767bc64c050a88ddda',
    "/collection/aptos-lions-club": '0xfaf703bb64edeeb46312df24a8fb306e57b21e7c3631ba3c9c4474795001bd85',
    "/collection/aptos-alpha-alpacas": '0x84f02208f8caf4e43f8162f0d9ba42876f60dbf74ea54819b1c6b22ab5dcd72c',
    "/collection/guess-the-dip": '0x2edff2f20ee3ec1434977eebe0ff4436d90c01d0aaad4ea6457c2b336e9d73ab',
    "/collection/puking-bee-club": '0x2f218a6358e0966506badc782c24aff7581411359c09ff74febbd0722684f5b',
    "/collection/skellies-lab-nft": '0x39e5303dff44ce76d095fb3b92e2e7294a17b6e2a61690d2f63cfcbdb7d4c97e',
    "/collection/live-bait": '0x6249f3c07940f2f408eea84be1a582666ebbc564b917f8d08a7e61d8b5c6bfda',
    "/collection/goat-squad-nft": '0xbbb13e61bb957d56ca3a887484879988a20c169219d2f809e53f6ceeec5562ba',
    "/collection/move-name-service-v1": '0x4fcb1a8940f7d2d4813d341692500870c8de42e512b65e1760d90018580274db',
    "/collection/monaki": '0xf789ef8bdbeae6a1111d6507b4f209a4490efc0c051b4393b3bdb353316ebe60',
    "/collection/spooks": '0xb12429247452bc5f34d8c3271375bef4f9972ff9e8a16a279f5841ea73d0535d',
    "/collection/turtles": '0x6ccb3130a3441a8112af48e2ad928a3feecf01c125ba0629a3d7dfc486fe6cc2',
    "/collection/aptos-kids": '0xbd6e30caa18e240590440b64feb1eb3f6d45620925e74fd92e4c82d142b76ef3',
    "/collection/nothing": '0x828035f74b19969b24c259ef4d9494e0c095ea12d56b6c9614251c4e6e8aa38d',
    "/collection/aptos-cat-gang": '0xa7979574759ba8787ba905e3fb0cbfdf1e790cee57c3ee14cc4b66e41cc42c8a',
    "/collection/aptos-bearables": '0x47c85ba947f2e47608a9c5096a6eef469773d05cf624b596a5d281d1e49b56a5',
    "/collection/piggy-cyborgs": '0x43ff51f7f8acd106c9d49be3a36cbd37702fbe0f273409bbf4d8b32383a323f3',
    "/collection/tigers-aptos-club": '0x4c088afc01a8311cd6f65774dfc99b92cc13a25044013acff067ff7c22ba8cd2',
    "/collection/dope-deerz": '0xb09f8a06af8e27ff72d8689ae0376bb22859c1627ec7b1504469da7b97113b49',
    "/collection/meta-candy-pigs": '0x740a77a7883ba11b8c90557272ab9b495fc510d11eeb8383fd83e17cf14ecd4a',
    "/collection/shikoku-四国区": '0x572aeaded5f20a7e4cfc4cfcbbd24f597df787f7796b2de7f63f6dcca0452465',
    "/collection/world-cup-2022": '0x6f95fd880ddb5fba58769f1961881b23f9fbcd8c9c240aa3b1b399c09a38a80b',
    "/collection/aptos-rats": '0x6f9b4a28dd41cf9ac9c37e6c9e141a76bcf38755acc9f7858618c9eca62b9d44',
    "/collection/aptos-human-club": '0x5c695cad0308e77a2bab81951a46c6eae9170eae9d9413ac573f2e9329c6e8fd',
    "/collection/the-aptonians": '0xd29d4cd22a4c74309b8cc4dc441b03271bb39944a5ac357c03695b199a0a670b',
    "/collection/aptos-flip": '0x774a19675056a4372b4c716acf880336a42292e9360e7ec1b5cc0ca3aebd7893',
    "/collection/Aptos-Undead": '0x5a4505c2e96370b1f3592035109979011bd1a0c5cfe497b922b2584b4a90dfdb',
    "/collection/cosmic-crocs": '0xa4eb8e4facdc7da8dc4f85b6b1fa5ae82bf394036c94f1bfdea50d35c5066ac1',
    "/collection/alpha-moves": '0x29cf39fcd2aebfc35bac58b9176d6f7ac2f78b5bb87941bba32a07713a47d387',
    "/collection/aptos-punks": '0x185479c6c8d8d649c9203938f322e783a11a3101006ee8c39ace252f99b9d155',
    "/collection/dino-fatties": '0xdb89326ac5d1820b10450311f498fe7c339e7eaed3e232bb1e599c26892d34ad',
    "/collection/thing": '0x97e6db122db36f940c2508d07d16d26023766ec6790f3de4660f38774274a0a',
    "/collection/aptos-lands": '0xb8cb7caa48cbde1c2a2d1c36cbedaa30680b6186a2dcf0de45d322420f7da3e',
    "/collection/bruh-bears": '0x43ec2cb158e3569842d537740fd53403e992b9e7349cc5d3dfaa5aff8faaef2',
    "/collection/into-the-chibverse": '0x4175628f44a3b417388cd3b67ca592798c1a94a690d340fa0ee72e8f1c9c82be',
    "/collection/thugbullz": '0x430e1eabc78d2bc8e2ddb5517c4aa37473c166e61095494ff78739dce20bd91a',
    "/collection/p-gang": '0x829290d9fc84d4da0db3f9274d7a4bf098630055f996da415c60fc9ebd0ea982',
    "/collection/facadenft": '0x1dd22cda5fa092566f694700d0332b4d41809c896ccf1999fbc12b82cd816b28',
    "/collection/arcana-eggs": '0x7548be93e8e918b07d2f4e8e87e2933057bee3e1870a64cde1f80008caec9070',
    "/collection/melted-sapien": '0x85a8f7e1d6c0288200f004ba2d17aba81aa8e4287e1e58512748a4e237788722',
    "/collection/Pontem-Space-Pirates": '0xc46dd298b89d38314b486b2182a6163c4c955dce3509bf30751c307f5ecc2f36',
    "/collection/nevermores": '0x83c31ec81714e1952b95b33361cd2f1da82a2f26eb5771c8d41f27ae664bc2f9',
    "/collection/vampies": '0xb6eeb4fd3995a1e7899d13922ea528c7ff735d12adfa307afe274961668b354d',
    "/collection/cute-elf": '0x1ac67c690ddd45f4aeb9f564b919ba45d8bd90a200a4e1b0fbac074a39429eac',
    "/collection/moon-otters": '0x9694a1649293555d37ddcb837c62727845c2101dd265567fbe3f5c534cfadd80',
    "/collection/aptos-glitch-labs": '0x1d70a81e4cfebe55654af04b053fb628f979042924885991964952984a11e293',
    "/collection/the-things": '0xd1a039dab2e704e9efbc0286a9293c8c9995635d2fc4869ef15915ac97d42465',
    "/collection/AptosBulls": '0x8a6242a8b0dc233ee6219b3cdf092ef4aee183d599d7b7699387bb358bf7ac02',
    "/collection/spooky-show": '0x2b18a1d6869b8e17510265a9663f172fdf895222d1821d99488b58b7a70f1c34',
    "/collection/world-wide-crazy": '0xfc7aed117d41786e11083c696fe24f15190873e795e66a6b6bdd76f39ffe3007',
    "/collection/Apetos-Apes": '0xb116e5baf9412b2e9229a419a4fd5be795a1abf9855af7d1e1b1786979e2c922',
    "/collection/halloweenboi": '0x834048d84a968bd8aa1af5895903d8bd11168cc0cb7c9ce35eb549f6f4437bd6',
    "/collection/polkabridge": '0x562c385d0654d5592eba690ee6c744beb048b9a85010b85f6be4ea2e29a4ebc8',
    "/collection/unicornses": '0x9d03237b6a6e77581367670ec8f7317da859039d4339183317793d91255c4b3d',
    "/collection/genesis-vampires": '0xcf7f8e23f577e6916b127c420b0fedf26ad0d765e37eb25b5c495d822853a863',
    "/collection/nuigurumi": '0xee870e854bf80b4709e4f11152dffe714b5f5878875c5a648082cd6a74c17de4',
    "/collection/f1dog": '0x4a412660b1c9674ebd117432206b719d11ac5e7ec780e060b1dff3b2279e4061',
    "/collection/taisho-labs": '0xbfbae34b0a38993335832aff476d0087e0ae8d41dfe659b0ce6a138ce4af3c9a',
    "/collection/aptos-coinflip": '0x2f4a592c8ae1180b0d7b5588c420191949cb6abce115a6661c40cb05c12f7446',
    "/collection/aptos-monkeys": '0xf932dcb9835e681b21d2f411ef99f4f5e577e6ac299eebee2272a39fb348f702',
    "/collection/aptos-ant-club": '0x28c2af27910bdb99e9100c3f989448174cd44cb2b2c626f4e6b1d96b825beab7',
    "/collection/aptos-koalas-army": '0x7fa08adb35daf886a7cb04b416133462e0da2c9721588ccf83471aa2e0128af3',
    "/collection/aptos-wizards": '0x6d4336aeac8441314cacdd42ea7aae57b3fad71ea26a00186a23eb8f1fa19ffb',
    "/collection/retro-boys-club": '0xc2e477dd246bc55f0a894d4b7cf0d520a3c2431f915a317c67159a3c5f1c630a',
    "/collection/aptos-vampires": '0x84676759aa147b7197d6707ff7d301efa43fe774d17b58c2864307413b180635',
    "/collection/Aptos-Toad-Overload": '0x74b6b765f6710a0c24888643babfe337241ad1888a55e33ed86f389fe3f13f52',
    "/collection/Aptomingos": '0xc0e3fbf8ae61056d66ce624d71ccf1888f879355cc4e364ef117249b5e3160a8',
    "/collection/bigfoot-town": '0xd987fb9fda5453d71e5bc3ce57a74d6cddc0b245a0906a6e96b3ac1541aeda69',
    "/collection/alpha-sheep": '0x2afdec36ca61c4f972be17182ea25177cb87d91ea7f0b3c1c0879a8176b450c7',
    "/collection/aptos-names-v1": '0x305a97874974fdb9a7ba59dc7cab7714c8e8e00004ac887b6e348496e1981838'
};

module.exports = {
    collectionUrls,
    creatorAddresses
};