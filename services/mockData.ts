import { Team, ScheduleEntry, WeeklyScores, WeeklyMatchupResult, Bowler } from '../types';

const bowlersByTeam: Record<number, Bowler[]> = {
    1: [
        { id: 161, name: 'PATTY H. SYKES', average: 162, totalPins: 4382, gamesBowled: 27 },
        { id: 162, name: 'NANCY P. PRESLAR', average: 164, totalPins: 3954, gamesBowled: 24 },
        { id: 163, name: 'JEFF SPRAGUE', average: 199, totalPins: 5399, gamesBowled: 27 },
        { id: 164, name: 'STEPHEN ANGEL', average: 185, totalPins: 2789, gamesBowled: 15 },
        { id: 165, name: 'MARK HENSLEY', average: 197, totalPins: 4741, gamesBowled: 24 },
        { id: 351, name: 'RYAN BOYER', average: 203, totalPins: 1131, gamesBowled: 6 },
        { id: 373, name: 'JOSH PRESSLEY', average: 197, totalPins: 658, gamesBowled: 3 },
    ],
    2: [
        { id: 168, name: 'RODNEY E. NORMAN', average: 198, totalPins: 5366, gamesBowled: 27 },
        { id: 167, name: 'SHAD L. CHRISMON', average: 205, totalPins: 4324, gamesBowled: 21 },
        { id: 166, name: 'JOHN EULBERG', average: 213, totalPins: 3837, gamesBowled: 18 },
        { id: 9, name: 'RUSSELL KESTNER', average: 208, totalPins: 5640, gamesBowled: 27 },
        { id: 169, name: 'KEVIN T. BOYLAN', average: 201, totalPins: 5429, gamesBowled: 27 },
        { id: 321, name: 'GREG LYON', average: 209, totalPins: 0, gamesBowled: 0 },
    ],
    3: [
        { id: 170, name: 'TIM GALLI', average: 187, totalPins: 4489, gamesBowled: 24 },
        { id: 171, name: 'KEVIN W. SMITH', average: 192, totalPins: 5210, gamesBowled: 27 },
        { id: 172, name: 'DANIEL E. MILES', average: 200, totalPins: 4821, gamesBowled: 24 },
        { id: 173, name: 'DENNIS A. SMITH', average: 203, totalPins: 5481, gamesBowled: 27 },
        { id: 174, name: 'BILL MARSHALL', average: 198, totalPins: 5350, gamesBowled: 27 },
    ],
    4: [
        { id: 17, name: 'KIM GEE', average: 171, totalPins: 3091, gamesBowled: 18 },
        { id: 178, name: 'SEAN LAWRENCE', average: 179, totalPins: 4849, gamesBowled: 27 },
        { id: 175, name: 'SCOTT T. GEE', average: 209, totalPins: 5667, gamesBowled: 27 },
        { id: 177, name: 'SCOTT LAWRENCE', average: 217, totalPins: 5215, gamesBowled: 24 },
        { id: 176, name: 'DANIEL GEE', average: 221, totalPins: 4732, gamesBowled: 21 },
        { id: 352, name: 'JASON GREER', average: 208, totalPins: 634, gamesBowled: 3 },
        { id: 360, name: 'AMANDA MILLER', average: 159, totalPins: 1435, gamesBowled: 9 },
    ],
    5: [
        { id: 179, name: 'MEGAN MABE', average: 232, totalPins: 2788, gamesBowled: 12 },
        { id: 180, name: 'TODD M. PIATT', average: 200, totalPins: 3606, gamesBowled: 18 },
        { id: 181, name: 'THAD H. VALENTINE', average: 206, totalPins: 4948, gamesBowled: 24 },
        { id: 182, name: 'BRAD KURTH', average: 210, totalPins: 4411, gamesBowled: 21 },
        { id: 183, name: 'STEPHEN E. HOPKINS', average: 192, totalPins: 4618, gamesBowled: 24 },
        { id: 184, name: 'AMANDA R. KURTH', average: 185, totalPins: 600, gamesBowled: 3 },
        { id: 322, name: 'ANDREW K. FLYNT', average: 210, totalPins: 5061, gamesBowled: 24 },
    ],
    6: [
        { id: 185, name: 'BRIAN NELSON', average: 157, totalPins: 4255, gamesBowled: 27 },
        { id: 186, name: 'JOHN SCHLOEMER', average: 188, totalPins: 5099, gamesBowled: 27 },
        { id: 187, name: 'TAMMY M. THOMPSON', average: 200, totalPins: 5406, gamesBowled: 27 },
        { id: 188, name: 'KATHY L. WILLARD', average: 212, totalPins: 4462, gamesBowled: 21 },
        { id: 189, name: 'BRAD E. THOMPSON', average: 198, totalPins: 5355, gamesBowled: 27 },
        { id: 323, name: 'KADY NELSON', average: 126, totalPins: 375, gamesBowled: 3 },
        { id: 357, name: 'THAMOUS MCNAIR', average: 187, totalPins: 530, gamesBowled: 3 },
    ],
    7: [
        { id: 190, name: 'JARRED MILLER', average: 211, totalPins: 5713, gamesBowled: 27 },
        { id: 191, name: 'R. KATIE SAVALLE', average: 201, totalPins: 4844, gamesBowled: 24 },
        { id: 192, name: 'IAIN KOPP', average: 207, totalPins: 5603, gamesBowled: 27 },
        { id: 193, name: 'JOHN E. KOPP III', average: 203, totalPins: 5481, gamesBowled: 27 },
        { id: 194, name: 'DON MICHAEL FREEMAN', average: 214, totalPins: 5796, gamesBowled: 27 },
        { id: 353, name: 'ALFRED HILL', average: 194, totalPins: 567, gamesBowled: 3 },
        { id: 364, name: 'JOHNNY TODD', average: 177, totalPins: 0, gamesBowled: 0 },
    ],
    8: [
        { id: 195, name: 'ZACH BRANN', average: 199, totalPins: 2394, gamesBowled: 12 },
        { id: 196, name: 'CONNER NELSON', average: 206, totalPins: 3716, gamesBowled: 18 },
        { id: 197, name: 'BRYANT A. CARDEN', average: 211, totalPins: 5709, gamesBowled: 27 },
        { id: 198, name: 'ALBERT LIGGINS', average: 202, totalPins: 4261, gamesBowled: 21 },
        { id: 199, name: 'T.J. ROSE', average: 208, totalPins: 5639, gamesBowled: 27 },
        { id: 347, name: 'THOMAS MATTHEWS', average: 189, totalPins: 569, gamesBowled: 3 },
        { id: 348, name: 'JOSH WHEELER', average: 211, totalPins: 1907, gamesBowled: 9 },
    ],
    9: [
        { id: 200, name: 'BENNIE COOPER III', average: 206, totalPins: 2474, gamesBowled: 12 },
        { id: 201, name: 'DAVE KLINKO II', average: 208, totalPins: 4384, gamesBowled: 21 },
        { id: 202, name: 'MIKE DAVIS JR', average: 216, totalPins: 5199, gamesBowled: 24 },
        { id: 205, name: 'DENNIS A. DAVIS', average: 205, totalPins: 4943, gamesBowled: 24 },
        { id: 203, name: 'KEITH BERTRAM', average: 237, totalPins: 6418, gamesBowled: 27 },
        { id: 363, name: 'KIMBERLY WILKERSON', average: 204, totalPins: 1302, gamesBowled: 6 },
        { id: 206, name: 'DAWSON HOOVER', average: 215, totalPins: 2582, gamesBowled: 12 },
    ],
    10: [
        { id: 207, name: 'EDUARDO MERCADO', average: 204, totalPins: 4909, gamesBowled: 24 },
        { id: 208, name: 'TD CARMICHAEL', average: 221, totalPins: 5327, gamesBowled: 24 },
        { id: 209, name: 'KRISTIN A. SHINN', average: 187, totalPins: 4942, gamesBowled: 27 },
        { id: 210, name: 'CHRIS CARPENTER', average: 230, totalPins: 5533, gamesBowled: 24 },
        { id: 211, name: 'RANSOM D. ROYAL', average: 219, totalPins: 5931, gamesBowled: 27 },
        { id: 212, name: 'STEPHANIE N. SMITH', average: 203, totalPins: 0, gamesBowled: 0 },
        { id: 213, name: 'CHAD PLASS', average: 213, totalPins: 0, gamesBowled: 0 },
    ],
    11: [
        { id: 214, name: 'DWIGHT A. ADAMS', average: 229, totalPins: 6205, gamesBowled: 27 },
        { id: 215, name: 'KEITH MCNEIL JR', average: 211, totalPins: 5716, gamesBowled: 27 },
        { id: 216, name: 'DAVID L. GARDNER', average: 216, totalPins: 4547, gamesBowled: 21 },
        { id: 366, name: 'ANDERSON SPRINGFIELD', average: 215, totalPins: 2581, gamesBowled: 12 },
        { id: 365, name: 'DANIEL BRIGHT', average: 215, totalPins: 5837, gamesBowled: 27 },
        { id: 368, name: 'CRISTINA ACOSTA', average: 209, totalPins: 1163, gamesBowled: 6 },
        { id: 369, name: 'COURTNEY STITH', average: 209, totalPins: 559, gamesBowled: 3 },
    ],
    12: [
        { id: 219, name: 'DUSTIN GRAY', average: 190, totalPins: 4951, gamesBowled: 26 },
        { id: 220, name: 'JASON DENNIS', average: 178, totalPins: 1605, gamesBowled: 9 },
        { id: 221, name: 'BUCK HALL', average: 206, totalPins: 5562, gamesBowled: 27 },
        { id: 222, name: 'ELBERT CAIN', average: 206, totalPins: 5574, gamesBowled: 27 },
        { id: 223, name: 'ADAM PAYNE', average: 191, totalPins: 5161, gamesBowled: 27 },
        { id: 224, name: 'TIM LAMONDS', average: 215, totalPins: 0, gamesBowled: 0 },
        { id: 358, name: 'SHORTY KIMMONS', average: 204, totalPins: 2454, gamesBowled: 12 },
    ],
    13: [
        { id: 225, name: 'TERRY N. PETRIDIS', average: 184, totalPins: 4986, gamesBowled: 27 },
        { id: 226, name: 'CHASE DUDLEY', average: 208, totalPins: 5024, gamesBowled: 24 },
        { id: 324, name: 'MIKE MILLER', average: 207, totalPins: 4358, gamesBowled: 21 },
        { id: 227, name: 'KEITH DAVIS', average: 224, totalPins: 6052, gamesBowled: 27 },
        { id: 228, name: 'TONY L. BURCHETTE', average: 228, totalPins: 5495, gamesBowled: 24 },
        { id: 229, name: 'GEOFF BLAKE', average: 202, totalPins: 1175, gamesBowled: 6 },
        { id: 359, name: 'RUSTY MORRISON', average: 213, totalPins: 0, gamesBowled: 0 },
    ],
    14: [
        { id: 230, name: 'MARCUS TAYLOR', average: 190, totalPins: 4002, gamesBowled: 21 },
        { id: 231, name: 'LESLIE SMITH', average: 201, totalPins: 4233, gamesBowled: 21 },
        { id: 232, name: 'MELVIN INGRAM', average: 187, totalPins: 3366, gamesBowled: 18 },
        { id: 69, name: 'MACK SMITH JR', average: 206, totalPins: 3724, gamesBowled: 18 },
        { id: 233, name: 'BEN JACKSON JR', average: 198, totalPins: 5369, gamesBowled: 27 },
        { id: 234, name: 'DEMARCUS BRADLEY', average: 199, totalPins: 1798, gamesBowled: 9 },
        { id: 235, name: 'STEVE HARRISON', average: 179, totalPins: 3767, gamesBowled: 21 },
    ],
    15: [
        { id: 236, name: 'ALFREDO R. ALTNOR', average: 187, totalPins: 4492, gamesBowled: 24 },
        { id: 237, name: 'SHANNON MORGAN', average: 161, totalPins: 1457, gamesBowled: 9 },
        { id: 73, name: 'CHRIS ROSS', average: 187, totalPins: 4493, gamesBowled: 24 },
        { id: 238, name: 'ROBIN STALLINGS', average: 182, totalPins: 3833, gamesBowled: 21 },
        { id: 239, name: 'CHRISTINA HENRY', average: 197, totalPins: 4337, gamesBowled: 22 },
        { id: 240, name: 'GARETH H. HATFIELD', average: 220, totalPins: 3965, gamesBowled: 18 },
        { id: 327, name: 'DONTREL FITZGERALD', average: 223, totalPins: 614, gamesBowled: 3 },
    ],
    16: [
        { id: 241, name: 'MICHELLE R. HOPKINS', average: 174, totalPins: 3658, gamesBowled: 21 },
        { id: 242, name: 'PAM EANES', average: 153, totalPins: 3681, gamesBowled: 24 },
        { id: 243, name: 'BOBBIE S. BEARD', average: 163, totalPins: 3922, gamesBowled: 24 },
        { id: 79, name: 'ASHLEY MANUEL', average: 144, totalPins: 1730, gamesBowled: 12 },
        { id: 244, name: 'JOSH HILL', average: 197, totalPins: 4732, gamesBowled: 24 },
        { id: 245, name: 'JAMES BEARD SR', average: 190, totalPins: 3424, gamesBowled: 18 },
        { id: 367, name: 'MEAGAN ALFORD', average: 202, totalPins: 523, gamesBowled: 3 },
    ],
    17: [
        { id: 247, name: 'KEN HOTALING', average: 216, totalPins: 5837, gamesBowled: 27 },
        { id: 248, name: 'RANDALL COX', average: 212, totalPins: 5095, gamesBowled: 24 },
        { id: 83, name: 'TIM FLINCHUM', average: 205, totalPins: 4926, gamesBowled: 24 },
        { id: 84, name: 'MARTY SWEATT', average: 207, totalPins: 5608, gamesBowled: 27 },
        { id: 249, name: 'CHICO VALENZUELA', average: 209, totalPins: 5662, gamesBowled: 27 },
        { id: 355, name: 'RANDY L. MCWILLIAMS', average: 224, totalPins: 1143, gamesBowled: 6 },
        { id: 356, name: 'EDDIE SPIVEY', average: 0, totalPins: 0, gamesBowled: 0 },
    ],
    18: [
        { id: 86, name: 'AMANDA STONE', average: 193, totalPins: 4632, gamesBowled: 24 },
        { id: 250, name: 'RICKARDO HOWELL', average: 191, totalPins: 4605, gamesBowled: 24 },
        { id: 88, name: 'MICHAEL STONE', average: 236, totalPins: 6375, gamesBowled: 27 },
        { id: 251, name: 'SCOTT SMITH', average: 200, totalPins: 4209, gamesBowled: 21 },
        { id: 252, name: 'MATT VERDON', average: 219, totalPins: 5936, gamesBowled: 27 },
        { id: 253, name: 'CHRIS BRYANT', average: 219, totalPins: 576, gamesBowled: 3 },
        { id: 254, name: 'MATT TEDDER', average: 228, totalPins: 2052, gamesBowled: 9 },
    ],
    19: [
        { id: 255, name: 'CHRISTY MYRICK', average: 193, totalPins: 2903, gamesBowled: 15 },
        { id: 256, name: 'JIM TEER', average: 186, totalPins: 3909, gamesBowled: 21 },
        { id: 257, name: 'MIKE MYRICK', average: 205, totalPins: 5559, gamesBowled: 27 },
        { id: 258, name: 'CORY GORDON', average: 215, totalPins: 5180, gamesBowled: 24 },
        { id: 259, name: 'CHRIS PHILLIPS', average: 221, totalPins: 5324, gamesBowled: 24 },
        { id: 260, name: 'SHAWN HALE', average: 207, totalPins: 4354, gamesBowled: 21 },
        { id: 261, name: 'JIMMY MARTIN', average: 224, totalPins: 0, gamesBowled: 0 },
    ],
    20: [
        { id: 262, name: 'JAMIE A. BROCKINGTON S', average: 173, totalPins: 4682, gamesBowled: 27 },
        { id: 263, name: 'SHANNA MCDONNELL', average: 171, totalPins: 4618, gamesBowled: 27 },
        { id: 264, name: 'DEMARIUS A. NICHOLS', average: 175, totalPins: 4734, gamesBowled: 27 },
        { id: 265, name: 'RON BLAKNEY', average: 208, totalPins: 2708, gamesBowled: 13 },
        { id: 266, name: 'CLIFF DUNN', average: 206, totalPins: 4336, gamesBowled: 21 },
        { id: 329, name: 'SETH BOONE', average: 198, totalPins: 576, gamesBowled: 3 },
        { id: 330, name: 'MAURICE E. JONES', average: 191, totalPins: 582, gamesBowled: 3 },
    ],
    21: [
        { id: 267, name: 'RAY PAQUIN', average: 188, totalPins: 4703, gamesBowled: 25 },
        { id: 268, name: 'CARRIE PISZTON', average: 180, totalPins: 3252, gamesBowled: 18 },
        { id: 270, name: 'DERRICK N. HAMLIN', average: 185, totalPins: 3886, gamesBowled: 21 },
        { id: 269, name: 'TIM UTT', average: 190, totalPins: 4007, gamesBowled: 21 },
        { id: 271, name: 'JIMMY C. WATTS JR', average: 199, totalPins: 5395, gamesBowled: 27 },
        { id: 331, name: 'RYAN SPOOR', average: 193, totalPins: 2904, gamesBowled: 15 },
    ],
    22: [
        { id: 272, name: 'JOHN A. SMITH JR', average: 207, totalPins: 4983, gamesBowled: 24 },
        { id: 273, name: 'JASON D. REDD', average: 212, totalPins: 5730, gamesBowled: 27 },
        { id: 274, name: 'SJ CULBERTSON JR', average: 205, totalPins: 5541, gamesBowled: 27 },
        { id: 275, name: 'ANDY HELING', average: 220, totalPins: 5956, gamesBowled: 27 },
        { id: 276, name: 'CHRIS L. BRACKEN', average: 222, totalPins: 4672, gamesBowled: 21 },
        { id: 277, name: 'MATT D. PHILLIPS', average: 211, totalPins: 783, gamesBowled: 3 },
        { id: 278, name: 'RYAN C. SMITH', average: 197, totalPins: 646, gamesBowled: 3 },
    ],
    23: [
        { id: 279, name: 'DERON GUNTHROPE', average: 191, totalPins: 5161, gamesBowled: 27 },
        { id: 281, name: 'LEE MACK', average: 203, totalPins: 5485, gamesBowled: 27 },
        { id: 282, name: 'CAMERON MACK', average: 218, totalPins: 5893, gamesBowled: 27 },
        { id: 283, name: 'TAFT MACK', average: 211, totalPins: 5700, gamesBowled: 27 },
        { id: 280, name: 'MARKEEN CARMICHAEL', average: 202, totalPins: 1820, gamesBowled: 9 },
        { id: 371, name: 'MARIO MACK', average: 201, totalPins: 3624, gamesBowled: 18 },
        { id: 372, name: 'KRISTEN STAMPER', average: 187, totalPins: 0, gamesBowled: 0 },
    ],
    24: [
        { id: 116, name: 'CURTIS DIAZ', average: 214, totalPins: 5778, gamesBowled: 27 },
        { id: 285, name: 'TOMMY J. BARE', average: 200, totalPins: 5408, gamesBowled: 27 },
        { id: 286, name: 'GREGG EPPSLEY', average: 219, totalPins: 5924, gamesBowled: 27 },
        { id: 287, name: 'TIM DILLON', average: 223, totalPins: 6025, gamesBowled: 27 },
        { id: 288, name: 'ZAC LUDWIG', average: 211, totalPins: 4431, gamesBowled: 21 },
        { id: 332, name: 'AARON B. LYONS', average: 210, totalPins: 607, gamesBowled: 3 },
        { id: 342, name: 'STEPHEN K. FOLEY', average: 207, totalPins: 0, gamesBowled: 0 },
    ],
    25: [
        { id: 289, name: 'MAL E. WILLIAMS JR', average: 207, totalPins: 4991, gamesBowled: 24 },
        { id: 288, name: 'JASON B. TRIPLETT', average: 202, totalPins: 4991, gamesBowled: 24 },
        { id: 290, name: 'DWAYNE CAMPBELL', average: 215, totalPins: 5166, gamesBowled: 24 },
        { id: 291, name: 'TYLER TEEPLE', average: 215, totalPins: 5824, gamesBowled: 27 },
        { id: 292, name: 'DRE GAITHER', average: 219, totalPins: 6267, gamesBowled: 27 },
        { id: 334, name: 'JACOB L. SHIPLEY', average: 227, totalPins: 1195, gamesBowled: 6 },
        { id: 344, name: 'CHLOE NEWBERRY', average: 190, totalPins: 2280, gamesBowled: 12 },
    ],
    26: [
        { id: 295, name: 'HAYSHA GRIFFIN', average: 185, totalPins: 4462, gamesBowled: 24 },
        { id: 296, name: 'TIMOTHY DRUMM', average: 211, totalPins: 4443, gamesBowled: 21 },
        { id: 293, name: 'JUSTIN M. PARHAM', average: 197, totalPins: 4147, gamesBowled: 21 },
        { id: 294, name: 'KENNETH LOWE JR', average: 224, totalPins: 5378, gamesBowled: 24 },
        { id: 130, name: 'ANTIONE D. ROBINSON', average: 207, totalPins: 4358, gamesBowled: 21 },
        { id: 297, name: 'BRIANNA MONROE', average: 173, totalPins: 605, gamesBowled: 3 },
        { id: 370, name: 'TIA CURRENCE', average: 178, totalPins: 1970, gamesBowled: 24 },
    ],
    27: [
        { id: 298, name: 'BILL HAYWOOD', average: 166, totalPins: 4500, gamesBowled: 27 },
        { id: 299, name: 'KELLY TOMPKINS', average: 164, totalPins: 4266, gamesBowled: 26 },
        { id: 300, name: 'KELSEY WYATT', average: 173, totalPins: 4691, gamesBowled: 27 },
        { id: 301, name: 'SHANE MCDONNELL', average: 219, totalPins: 5915, gamesBowled: 27 },
        { id: 302, name: 'SHAUNE LEGER', average: 196, totalPins: 5314, gamesBowled: 27 },
        { id: 303, name: 'MINDY LECLAIR', average: 155, totalPins: 0, gamesBowled: 0 },
    ],
    28: [
        { id: 304, name: 'LYNNE MCLEOD', average: 217, totalPins: 5225, gamesBowled: 24 },
        { id: 306, name: 'BRIDGETTE TRIPP', average: 195, totalPins: 4096, gamesBowled: 21 },
        { id: 305, name: 'VERSAIL RODDEY', average: 200, totalPins: 3601, gamesBowled: 18 },
        { id: 343, name: 'QUAN BEATHEA', average: 230, totalPins: 5527, gamesBowled: 24 },
        { id: 307, name: 'JEFF EDDINS', average: 207, totalPins: 5604, gamesBowled: 27 },
        { id: 308, name: 'LAWRENCE E. LOWE JR', average: 210, totalPins: 2528, gamesBowled: 12 },
        { id: 369, name: 'RANDY PRIEST', average: 217, totalPins: 0, gamesBowled: 0 },
    ],
    29: [
        { id: 141, name: 'GIOVANNI BOONE', average: 172, totalPins: 3622, gamesBowled: 21 },
        { id: 142, name: 'BRANDON WILLIAMS', average: 196, totalPins: 4726, gamesBowled: 24 },
        { id: 143, name: 'RAJEE WILSON', average: 191, totalPins: 4025, gamesBowled: 21 },
        { id: 309, name: 'JAMES LEDBETTER', average: 211, totalPins: 5700, gamesBowled: 27 },
        { id: 310, name: 'BJ DUNCAN', average: 207, totalPins: 5405, gamesBowled: 27 },
        { id: 341, name: 'JAMAL POE', average: 199, totalPins: 1275, gamesBowled: 6 },
    ],
    30: [
        { id: 346, name: 'CALEB MABE', average: 200, totalPins: 4213, gamesBowled: 21 },
        { id: 311, name: 'DILLAN RIVET', average: 178, totalPins: 3740, gamesBowled: 21 },
        { id: 337, name: 'JESSICA LEWIS', average: 196, totalPins: 2381, gamesBowled: 12 },
        { id: 315, name: 'LEGACY J. PALMER', average: 195, totalPins: 2936, gamesBowled: 15 },
        { id: 316, name: 'SCOTT SAYERS', average: 198, totalPins: 2980, gamesBowled: 15 },
        { id: 317, name: 'RON JANTZ', average: 198, totalPins: 2980, gamesBowled: 15 },
        { id: 318, name: 'JEREMY JOHNSON', average: 203, totalPins: 609, gamesBowled: 3 },
    ],
    31: [
        { id: 316, name: 'TONY BRUNO', average: 210, totalPins: 4418, gamesBowled: 21 },
        { id: 317, name: 'ANDREW NOBLE', average: 213, totalPins: 5767, gamesBowled: 27 },
        { id: 153, name: 'JEFF BRADSHAW', average: 204, totalPins: 4298, gamesBowled: 21 },
        { id: 154, name: 'JOSH MERRITT', average: 211, totalPins: 5714, gamesBowled: 27 },
        { id: 318, name: 'JOSH FIELDS', average: 224, totalPins: 6068, gamesBowled: 27 },
        { id: 319, name: 'RODNEY EANES', average: 200, totalPins: 1850, gamesBowled: 9 },
        { id: 320, name: 'JOHNNY ROGERS', average: 195, totalPins: 1760, gamesBowled: 9 },
    ],
    32: [
        { id: 338, name: 'MELISSA HIGDON', average: 176, totalPins: 3698, gamesBowled: 21 },
        { id: 158, name: 'NATE HUDSON', average: 186, totalPins: 5024, gamesBowled: 27 },
        { id: 157, name: 'JERRY SAFERIGHT', average: 205, totalPins: 4850, gamesBowled: 24 },
        { id: 339, name: 'BRANDI L. BAREFOOT', average: 202, totalPins: 4922, gamesBowled: 24 },
        { id: 390, name: 'BRANDON JAMES', average: 207, totalPins: 5608, gamesBowled: 27 },
        { id: 362, name: 'CATHY MCCORDLESS', average: 201, totalPins: 1126, gamesBowled: 6 },
        { id: 361, name: 'MIKE GATTIS', average: 199, totalPins: 0, gamesBowled: 0 },
    ]
};

const teamData: { id: number; name: string; points: number; scratchPins: number; hdcpPins: number; penalty: number; }[] = [
    { id: 22, name: "COME SEE US", points: 63, scratchPins: 28944, hdcpPins: 28965, penalty: 20 },
    { id: 2, name: "OL' WATERING HOLE", points: 53, scratchPins: 27575, hdcpPins: 27863, penalty: 45 },
    { id: 9, name: "DAMN FEES", points: 52, scratchPins: 29041, hdcpPins: 29041, penalty: 50 },
    { id: 7, name: "4 JERKS+A SQUIRT", points: 52, scratchPins: 28004, hdcpPins: 28331, penalty: 75 },
    { id: 18, name: "DISORDERLY CONDUCT", points: 51, scratchPins: 28385, hdcpPins: 28472, penalty: 30 },
    { id: 5, name: "3RD GAME MONEY", points: 51, scratchPins: 27841, hdcpPins: 28195, penalty: 60 },
    { id: 28, name: "Team 28", points: 49, scratchPins: 28248, hdcpPins: 28662, penalty: 80 },
    { id: 19, name: "TOMMYKNOCKERS", points: 49, scratchPins: 27802, hdcpPins: 27922, penalty: 90 },
    { id: 10, name: "HIGH FIVES & F BOMBS", points: 48, scratchPins: 28878, hdcpPins: 29022, penalty: 15 },
    { id: 13, name: "5 GRINGO'S CARTEL", points: 48, scratchPins: 28320, hdcpPins: 28443, penalty: 25 },
    { id: 23, name: "THE SNIPERS", points: 48, scratchPins: 27683, hdcpPins: 28172, penalty: 55 },
    { id: 25, name: "#SNEAKYGOOD", points: 47, scratchPins: 28373, hdcpPins: 28399, penalty: 40 },
    { id: 31, name: "GAME ON", points: 45, scratchPins: 28619, hdcpPins: 28619, penalty: 70 },
    { id: 11, name: "GET IT OUT THE PIT", points: 44, scratchPins: 29166, hdcpPins: 29166, penalty: 110 },
    { id: 24, name: "UNDER PRESSURE", points: 43, scratchPins: 28776, hdcpPins: 28878, penalty: 35 },
    { id: 32, name: "BOWL-DOZERS", points: 43, scratchPins: 26299, hdcpPins: 27370, penalty: 65 },
    { id: 17, name: "CMON CHICOS LESSONS", points: 42, scratchPins: 28271, hdcpPins: 28478, penalty: 85 },
    { id: 3, name: "NO REVS NEEDED", points: 38, scratchPins: 26452, hdcpPins: 27748, penalty: 95 },
    { id: 27, name: "WHAT THE PUCK", points: 38, scratchPins: 24839, hdcpPins: 27495, penalty: 100 },
    { id: 6, name: "SHOTS ON U", points: 36, scratchPins: 25482, hdcpPins: 27102, penalty: 10 },
    { id: 30, name: "THE REAL DEAL", points: 35, scratchPins: 25666, hdcpPins: 26995, penalty: 130 },
    { id: 16, name: "BOOZY BOWLERS", points: 34, scratchPins: 22876, hdcpPins: 25870, penalty: 140 },
    { id: 26, name: "REVAMPED", points: 32, scratchPins: 24594, hdcpPins: 24777, penalty: 5 },
    { id: 15, name: "AZZHOLES", points: 31, scratchPins: 25582, hdcpPins: 26980, penalty: 150 },
    { id: 12, name: "PAIN IN YOUR AZZ", points: 30, scratchPins: 26558, hdcpPins: 27350, penalty: 48 },
    { id: 4, name: "OFF CONSTANTLY", points: 30, scratchPins: 26913, hdcpPins: 27291, penalty: 58 },
    { id: 21, name: "UNBOWLIEVABLE", points: 30, scratchPins: 25580, hdcpPins: 27195, penalty: 68 },
    { id: 20, name: "OLD MAN CARRY", points: 30, scratchPins: 24740, hdcpPins: 26750, penalty: 78 },
    { id: 1, name: "BEAT THE ODDS", points: 29, scratchPins: 24563, hdcpPins: 26990, penalty: 88 },
    { id: 14, name: "NSL MOST HATED", points: 27, scratchPins: 26259, hdcpPins: 26496, penalty: 98 },
    { id: 8, name: "SHOULDA WOULDA COULDA", points: 26, scratchPins: 27693, hdcpPins: 27867, penalty: 108 },
    { id: 29, name: "GLADYS KNIGHT AND THE PIPS", points: 20, scratchPins: 26543, hdcpPins: 27005, penalty: 118 },
];

const generateTeams = (withPoints: boolean): Team[] => {
    return teamData.map(td => {
        const teamBowlers = bowlersByTeam[td.id] || [];
        return {
            id: td.id,
            teamNumber: td.id,
            name: td.name,
            bowlers: withPoints
                ? JSON.parse(JSON.stringify(teamBowlers)) // Deep copy to prevent mutation
                : teamBowlers.map(b => ({ 
                    ...b, 
                    totalPins: 0, 
                    gamesBowled: 0,
                    // For reset, keep book average. If a bowler has 0 average, give them a placeholder.
                    average: b.average > 0 ? b.average : 150 
                })),
            firstHalfPoints: withPoints ? td.points : 0,
            secondHalfPoints: 0,
            totalPoints: withPoints ? td.points : 0,
            totalScratchPins: withPoints ? td.scratchPins : 0,
            totalHdcpPins: withPoints ? td.hdcpPins : 0,
            totalPenalty: withPoints ? td.penalty : 0,
        };
    }).sort((a,b) => a.id - b.id);
};

// Initial state reflects week 9 standings
export const initialTeams: Team[] = generateTeams(true);

// Template for resetting the league
export const initialTeamsTemplate: Team[] = generateTeams(false);

const scheduleData: { week: number; date: string; matchups: [number, number][] }[] = [
    { week: 1, date: '2025-08-28', matchups: [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12], [13, 14], [15, 16], [17, 18], [19, 20], [21, 22], [23, 24], [25, 26], [27, 28], [29, 30], [31, 32]] },
    { week: 2, date: '2025-09-04', matchups: [[23, 17], [20, 22], [21, 29], [24, 31], [26, 27], [18, 28], [25, 30], [32, 19], [2, 12], [15, 3], [6, 4], [8, 1], [9, 13], [10, 11], [5, 14], [7, 16]] },
    { week: 3, date: '2025-09-11', matchups: [[18, 5], [19, 12], [22, 1], [23, 13], [25, 15], [4, 27], [29, 7], [31, 10], [21, 11], [16, 28], [3, 17], [2, 30], [32, 14], [20, 9], [24, 6], [26, 8]] },
    { week: 4, date: '2025-09-18', matchups: [[10, 25], [7, 23], [31, 15], [12, 27], [5, 22], [13, 29], [19, 4], [18, 1], [14, 26], [2, 24], [8, 32], [9, 28], [21, 3], [30, 6], [20, 16], [17, 11]] },
    { week: 5, date: '2025-09-25', matchups: [[24, 3], [21, 9], [11, 30], [32, 6], [8, 28], [16, 17], [2, 26], [14, 20], [19, 1], [4, 25], [5, 27], [22, 7], [23, 10], [12, 31], [18, 13], [15, 29]] },
    { week: 6, date: '2025-10-02', matchups: [[16, 32], [14, 30], [26, 9], [20, 3], [2, 17], [24, 8], [28, 11], [6, 21], [7, 31], [29, 5], [25, 13], [15, 19], [12, 18], [1, 23], [10, 27], [22, 4]] },
    { week: 7, date: '2025-10-09', matchups: [[7, 11], [16, 5], [13, 3], [15, 2], [14, 12], [9, 1], [10, 6], [4, 8], [27, 24], [21, 31], [30, 19], [32, 18], [28, 29], [17, 25], [22, 26], [20, 23]] },
    { week: 8, date: '2025-10-16', matchups: [[22, 25], [9, 5], [18, 10], [7, 2], [11, 19], [13, 31], [28, 24], [23, 17], [32, 4], [30, 3], [27, 14], [16, 26], [6, 15], [8, 12], [21, 20], [29, 1]] },
    { week: 9, date: '2025-10-23', matchups: [[19, 26], [24, 25], [27, 32], [22, 28], [23, 21], [30, 31], [20, 18], [17, 29], [13, 16], [1, 14], [9, 7], [10, 3], [2, 4], [8, 5], [15, 11], [6, 12]] },
    { week: 10, date: '2025-10-30', matchups: [[30, 22], [17, 27], [24, 18], [26, 29], [20, 31], [19, 21], [32, 23], [28, 25], [3, 5], [12, 9], [1, 11], [6, 13], [8, 15], [16, 4], [7, 2], [14, 10]] },
    { week: 11, date: '2025-11-06', matchups: [[15, 9], [8, 13], [10, 16], [11, 4], [6, 1], [7, 14], [3, 12], [5, 2], [25, 32], [30, 23], [26, 31], [20, 27], [22, 17], [24, 29], [19, 28], [21, 18]] },
    { week: 12, date: '2025-11-13', matchups: [[14, 4], [10, 2], [12, 8], [9, 5], [3, 7], [6, 15], [16, 11], [1, 13], [20, 29], [18, 26], [23, 28], [21, 25], [19, 24], [22, 32], [31, 17], [27, 30]] },
    { week: 13, date: '2025-11-20', matchups: [[28, 31], [29, 32], [25, 20], [17, 19], [30, 18], [23, 26], [21, 27], [22, 24], [8, 10], [6, 7], [14, 15], [12, 16], [5, 11], [2, 13], [9, 4], [3, 1]] },
    { week: 14, date: '2025-12-04', matchups: [[2, 21], [28, 3], [6, 17], [8, 30], [32, 9], [20, 11], [14, 24], [16, 26], [12, 22], [27, 15], [4, 18], [1, 29], [13, 31], [19, 10], [23, 5], [25, 7]] },
    { week: 15, date: '2025-12-11', matchups: [[13, 27], [31, 1], [19, 7], [18, 10], [4, 29], [25, 5], [15, 22], [12, 23], [30, 9], [17, 8], [24, 16], [26, 11], [20, 6], [21, 14], [3, 32], [28, 2]] },
    { week: 16, date: '2025-12-18', matchups: [[8, 20], [6, 26], [28, 14], [16, 21], [24, 11], [32, 2], [9, 17], [3, 30], [15, 23], [22, 13], [29, 10], [31, 4], [27, 1], [18, 7], [12, 25], [19, 5]] },
    { week: 17, date: '2026-01-08', matchups: [] }, // Position Round
    { week: 18, date: '2026-01-15', matchups: [[29, 12], [15, 18], [23, 4], [25, 1], [3, 19], [10, 22], [5, 31], [7, 27], [6, 28], [32, 11], [20, 2], [14, 17], [30, 16], [3, 26], [21, 8], [24, 9]] },
    { week: 19, date: '2026-01-22', matchups: [[26, 15], [4, 20], [1, 24], [13, 32], [10, 30], [17, 7], [12, 28], [21, 5], [18, 3], [25, 6], [19, 8], [27, 9], [11, 23], [31, 16], [2, 22], [29, 14]] },
    { week: 20, date: '2026-01-29', matchups: [[21, 24], [32, 17], [30, 26], [28, 20], [1, 5], [12, 4], [7, 13], [10, 15], [29, 19], [31, 27], [18, 23], [25, 22], [14, 8], [6, 2], [16, 9], [11, 3]] },
    { week: 21, date: '2026-02-05', matchups: [[32, 7], [1, 21], [17, 13], [30, 15], [28, 4], [5, 24], [26, 10], [20, 12], [16, 27], [8, 29], [31, 9], [3, 23], [6, 22], [14, 19], [11, 18], [2, 25]] },
    { week: 22, date: '2026-02-12', matchups: [[20, 10], [5, 7], [15, 28], [21, 17], [12, 26], [1, 13], [24, 32], [30, 4], [11, 25], [14, 16], [22, 3], [29, 31], [18, 2], [9, 8], [27, 19], [23, 6]] },
    { week: 23, date: '2026-02-19', matchups: [[6, 19], [27, 11], [29, 2], [14, 18], [16, 25], [31, 3], [23, 8], [9, 22], [24, 4], [10, 32], [12, 21], [5, 26], [7, 20], [15, 17], [30, 1], [13, 28]] },
    { week: 24, date: '2026-02-26', matchups: [[22, 16], [18, 8], [9, 25], [31, 11], [19, 2], [14, 23], [27, 3], [29, 6], [28, 7], [26, 1], [13, 20], [17, 10], [24, 12], [5, 30], [32, 15], [4, 21]] },
    { week: 25, date: '2026-03-05', matchups: [] }, // Position Round
    { week: 26, date: '2026-03-12', matchups: [[27, 23], [9, 6], [18, 31], [19, 25], [11, 14], [2, 16], [22, 29], [8, 3], [32, 30], [13, 4], [17, 26], [24, 20], [10, 5], [7, 12], [28, 21], [1, 15]] },
    { week: 27, date: '2026-03-19', matchups: [[9, 18], [2, 14], [16, 23], [27, 22], [29, 3], [8, 6], [31, 25], [19, 11], [26, 13], [5, 12], [7, 30], [28, 32], [15, 21], [4, 1], [17, 20], [10, 24]] },
    { week: 28, date: '2026-03-26', matchups: [[3, 14], [25, 29], [8, 11], [2, 9], [31, 23], [22, 19], [6, 16], [27, 18], [5, 15], [20, 21], [10, 1], [13, 12], [17, 30], [28, 24], [4, 7], [32, 26]] },
    { week: 29, date: '2026-04-02', matchups: [[5, 13], [12, 15], [7, 21], [4, 26], [17, 24], [28, 10], [30, 20], [1, 32], [9, 14], [3, 2], [16, 29], [18, 6], [31, 19], [11, 22], [25, 23], [8, 27]] },
    { week: 30, date: '2026-04-09', matchups: [[17, 1], [30, 28], [32, 5], [10, 12], [21, 13], [26, 20], [4, 15], [24, 7], [31, 8], [23, 22], [27, 14], [11, 2], [29, 9], [25, 18], [6, 3], [16, 19]] },
    { week: 31, date: '2026-04-16', matchups: [[12, 30], [13, 24], [4, 10], [1, 7], [15, 20], [21, 32], [17, 5], [26, 28], [23, 2], [9, 19], [11, 6], [16, 8], [3, 25], [29, 27], [14, 31], [18, 22]] },
    { week: 32, date: '2026-04-23', matchups: [[31, 6], [11, 16], [2, 27], [29, 23], [22, 8], [3, 9], [18, 19], [25, 14], [4, 17], [7, 10], [32, 12], [30, 21], [1, 28], [13, 15], [26, 24], [5, 20]] },
    { week: 33, date: '2026-04-30', matchups: [[11, 29], [22, 31], [3, 19], [6, 14], [18, 16], [27, 25], [8, 2], [23, 9], [10, 21], [28, 17], [15, 24], [4, 5], [26, 7], [32, 20], [1, 12], [30, 13]] },
    { week: 34, date: '2026-05-07', matchups: [] }, // Position Round
];


export const leagueSchedule: ScheduleEntry[] = scheduleData.map(s => {
    const lanes: [number, number][] = [
        [1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12], [13, 14], [15, 16],
        [17, 18], [19, 20], [21, 22], [23, 24], [25, 26], [27, 28], [29, 30], [31, 32]
    ];
    return {
        week: s.week,
        date: s.date,
        matchups: s.matchups.map(([team1Id, team2Id], index) => ({
            team1Id,
            team2Id,
            lanes: lanes[index]
        }))
    };
});


// Function to generate random scores based on bowler's average
const generateScores = (average: number): [number, number, number] => {
    const score1 = Math.floor(average + (Math.random() - 0.5) * 40);
    const score2 = Math.floor(average + (Math.random() - 0.5) * 40);
    const score3 = Math.floor(average + (Math.random() - 0.5) * 40);
    return [
      Math.max(0, Math.min(300, score1)),
      Math.max(0, Math.min(300, score2)),
      Math.max(0, Math.min(300, score3))
    ];
};

export const generateWeeklyScores = (week: number, teams: Team[], schedule: ScheduleEntry[]): WeeklyScores => {
    const weeklyScores: WeeklyScores = { week, teamScores: [] };
    const weekSchedule = schedule.find(s => s.week === week);

    if (!weekSchedule) {
        return weeklyScores;
    }
    
    const participatingTeamIds = new Set<number>();
    weekSchedule.matchups.forEach(m => {
      participatingTeamIds.add(m.team1Id);
      participatingTeamIds.add(m.team2Id);
    });

    teams.forEach(team => {
        if(participatingTeamIds.has(team.id)) {
            const bowlerScores = team.bowlers.map(bowler => ({
                bowlerId: bowler.id,
                scores: generateScores(bowler.average),
            }));
            weeklyScores.teamScores.push({ teamId: team.id, bowlerScores });
        }
    });

    return weeklyScores;
};


// Static data for Week 9 results from the PDF
export const week9Results: WeeklyMatchupResult[] = [
    { lanes: [1,2], team1: { id: 19, name: "TOMMYKNOCKERS", gameScores: [1113, 921, 1053], seriesScore: 3087, pointsWon: 2}, team2: { id: 26, name: "REVAMPED", gameScores: [971, 991, 1143], seriesScore: 3105, pointsWon: 7} },
    { lanes: [3,4], team1: { id: 24, name: "UNDER PRESSURE", gameScores: [1015, 1118, 1024], seriesScore: 3157, pointsWon: 7}, team2: { id: 25, name: "#SNEAKYGOOD", gameScores: [1041, 1009, 1012], seriesScore: 3062, pointsWon: 2} },
    { lanes: [5,6], team1: { id: 27, name: "WHAT THE PUCK", gameScores: [1001, 989, 910], seriesScore: 2900, pointsWon: 2}, team2: { id: 32, name: "BOWL-DOZERS", gameScores: [951, 1066, 980], seriesScore: 2997, pointsWon: 7} },
    { lanes: [7,8], team1: { id: 22, name: "COME SEE US", gameScores: [1114, 1078, 1072], seriesScore: 3264, pointsWon: 2}, team2: { id: 28, name: "Team 28", gameScores: [1028, 1163, 1107], seriesScore: 3298, pointsWon: 7} },
    { lanes: [9,10], team1: { id: 23, name: "THE SNIPERS", gameScores: [1007, 1020, 1079], seriesScore: 3106, pointsWon: 5}, team2: { id: 21, name: "UNBOWLIEVABLE", gameScores: [1019, 1067, 970], seriesScore: 3056, pointsWon: 4} },
    { lanes: [11,12], team1: { id: 30, name: "THE REAL DEAL", gameScores: [1042, 1189, 1065], seriesScore: 3296, pointsWon: 7}, team2: { id: 31, name: "GAME ON", gameScores: [1104, 1031, 1007], seriesScore: 3142, pointsWon: 2} },
    { lanes: [13,14], team1: { id: 20, name: "OLD MAN CARRY", gameScores: [1108, 1033, 1124], seriesScore: 3265, pointsWon: 9}, team2: { id: 18, name: "DISORDERLY CONDUCT", gameScores: [1015, 968, 1072], seriesScore: 3055, pointsWon: 0} },
    { lanes: [15,16], team1: { id: 17, name: "CMON CHICOS LESSONS", gameScores: [1180, 1076, 1079], seriesScore: 3335, pointsWon: 9}, team2: { id: 29, name: "GLADYS KNIGHT AND THE PIPS", gameScores: [829, 1046, 902], seriesScore: 2777, pointsWon: 0} },
    { lanes: [17,18], team1: { id: 13, name: "5 GRINGO'S CARTEL", gameScores: [1087, 1084, 1095], seriesScore: 3266, pointsWon: 9}, team2: { id: 16, name: "BOOZY BOWLERS", gameScores: [909, 964, 1035], seriesScore: 2908, pointsWon: 0} },
    { lanes: [19,20], team1: { id: 1, name: "BEAT THE ODDS", gameScores: [1030, 973, 932], seriesScore: 2935, pointsWon: 9}, team2: { id: 14, name: "NSL MOST HATED", gameScores: [872, 853, 901], seriesScore: 2626, pointsWon: 0} },
    { lanes: [21,22], team1: { id: 9, name: "DAMN FEES", gameScores: [1136, 1047, 1081], seriesScore: 3264, pointsWon: 2}, team2: { id: 7, name: "4 JERKS+A SQUIRT", gameScores: [1150, 1046, 1092], seriesScore: 3288, pointsWon: 7} },
    { lanes: [23,24], team1: { id: 10, name: "HIGH FIVES & F BOMBS", gameScores: [1142, 1091, 1069], seriesScore: 3302, pointsWon: 7}, team2: { id: 3, name: "NO REVS NEEDED", gameScores: [1025, 1018, 1088], seriesScore: 3131, pointsWon: 2} },
    { lanes: [25,26], team1: { id: 2, name: "OL' WATERING HOLE", gameScores: [1029, 1025, 1054], seriesScore: 3108, pointsWon: 9}, team2: { id: 4, name: "OFF CONSTANTLY", gameScores: [962, 997, 1014], seriesScore: 2973, pointsWon: 0} },
    { lanes: [27,28], team1: { id: 8, name: "SHOULDA WOULDA COULDA", gameScores: [1055, 1042, 1079], seriesScore: 3176, pointsWon: 3}, team2: { id: 5, name: "3RD GAME MONEY", gameScores: [1032, 1069, 1079], seriesScore: 3180, pointsWon: 6} },
    { lanes: [29,30], team1: { id: 15, name: "AZZHOLES", gameScores: [1086, 1124, 1047], seriesScore: 3257, pointsWon: 4}, team2: { id: 11, name: "GET IT OUT THE PIT", gameScores: [1072, 1076, 1200], seriesScore: 3348, pointsWon: 5} },
    { lanes: [31,32], team1: { id: 6, name: "SHOTS ON U", gameScores: [898, 1077, 1003], seriesScore: 2978, pointsWon: 7}, team2: { id: 12, name: "PAIN IN YOUR AZZ", gameScores: [949, 1055, 937], seriesScore: 2941, pointsWon: 2} }
];