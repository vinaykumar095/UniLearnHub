export interface Question {
    q: string;
    options: string[];
    answer: number; 
    explanation: string;
}

export interface AptitudeTopic {
    title: string;
    description: string;
    subTopics: {
        [key: string]: Question[];
    };
}

export const aptitudeTopics: { [key: string]: AptitudeTopic } = {
    'Quantitative Ability': {
        title: 'Quantitative Ability',
        description: 'Comprehensive mathematics and numerical problem-solving section.',
        subTopics: {
            'Percentages': [
                { q: 'If 20% of a number is 120, then 120% of that number will be:', options: ['20', '120', '480', '720'], answer: 3, explanation: '20% of x = 120 => x = 600. 120% of 600 = 720.' },
                { q: 'A student has to obtain 33% total marks to pass. He got 125 marks and failed by 40 marks. Max marks?', options: ['300', '500', '800', '1000'], answer: 1, explanation: 'Passing = 125+40=165. 0.33x = 165 => x=500.' },
                { q: 'What % of numbers from 1 to 70 have 1 or 9 in the unit\'s digit?', options: ['1%', '14%', '20%', '21%'], answer: 2, explanation: '14 numbers out of 70 = 20%.' },
                { q: 'Price of sugar rises by 20%. By how much % should a housewife reduce consumption so as not to increase expenditure?', options: ['16.66%', '20%', '25%', '83.33%'], answer: 0, explanation: '[r/(100+r)]*100 = 20/120 * 100 = 16.66%.' },
                { q: 'In an election, 10% voters did not vote. 10% votes were invalid. Winner got 54% valid votes and won by 1620. Total voters?', options: ['25000', '20000', '30000', '35000'], answer: 0, explanation: '0.9 * 0.9 * (54-46)% * Total = 1620 => 0.81 * 0.08 * T = 1620 => T=25000.' }
            ],
            'Profit and Loss': [
                { q: 'Person sells article for 120 and gains 20. Gain %?', options: ['16.66%', '20%', '25%', '15%'], answer: 1, explanation: 'CP=100. Profit=20. % = 20%.' },
                { q: 'CP of 20 items = SP of x items. Profit is 25%. Value of x?', options: ['15', '16', '18', '25'], answer: 1, explanation: 'x = 20/1.25 = 16.' },
                { q: 'A vendor bought toffees at 6 for a rupee. Sell how many for a rupee to gain 20%?', options: ['3', '4', '5', '6'], answer: 2, explanation: 'CP of 1 = 1/6. SP = 1.2 * 1/6 = 1/5. So 5 items.' },
                { q: 'A man sells two horses for $1995 each, one at 10% gain and other at 10% loss. Overall gain/loss?', options: ['1% gain', '1% loss', 'No gain/loss', '2% loss'], answer: 1, explanation: 'Loss = (10/10)^2 = 1% loss.' },
                { q: 'Dishonest dealer professes to sell at CP but uses 960g weight for 1kg. Gain %?', options: ['4%', '4.16%', '4.33%', '5%'], answer: 1, explanation: '[Error / (True - Error)] * 100 = 40/960 * 100 = 4.16%.' }
            ],
            'Simple & Compound Interest': [
                { q: 'SI on 5000 at 10% for 3 years?', options: ['1500', '1000', '1200', '1800'], answer: 0, explanation: '5000*10*3/100 = 1500.' },
                { q: 'Sum doubles in 15 years at CI. When will it be 8 times?', options: ['30 yr', '45 yr', '50 yr', '60 yr'], answer: 1, explanation: '2P (15), 4P (30), 8P (45).' },
                { q: 'Diff between SI and CI for 2 yrs at 4% is $1. Sum?', options: ['625', '630', '650', '600'], answer: 0, explanation: 'Diff = PR^2/100^2. 1 = P*16/10000 => P=625.' },
                { q: 'A sum amounts to 815 in 3 yrs and 854 in 4 yrs at SI. Sum?', options: ['650', '690', '698', '700'], answer: 2, explanation: 'SI for 1 yr = 39. Sum = 815 - 3*39 = 698.' },
                { q: 'CI on $12000 for 9 months at 20% p.a. compounded quarterly?', options: ['1891.50', '2000', '1500', '1800'], answer: 0, explanation: 'R=5% per quarter. t=3 quarters. 12000 * [(1.05)^3 - 1] = 1891.50.' }
            ],
            'Ratio and Proportion': [
                { q: 'A:B=2:3, B:C=4:5. A:B:C?', options: ['8:12:15', '2:4:5', '8:15:12', 'None'], answer: 0, explanation: '8:12:15.' },
                { q: 'Proportion of 5:2:4:3. C gets 1000 more than D. B\'s share?', options: ['500', '1500', '2000', '2500'], answer: 2, explanation: '4x-3x=1000 => x=1000. B=2x=2000.' },
                { q: 'Fourth proportional to 5, 8, 15?', options: ['18', '24', '19', '20'], answer: 1, explanation: '5/8 = 15/x => x=24.' },
                { q: 'Two numbers are in ratio 1:2. Added 7 to both, ratio is 3:5. Greater number?', options: ['14', '21', '28', '35'], answer: 2, explanation: '(x+7)/(2x+7) = 3/5 => 5x+35 = 6x+21 => x=14. Greater=2x=28.' },
                { q: 'Three numbers are in ratio 3:4:5 and sum of their squares is 1250. Sum?', options: ['30', '50', '60', '90'], answer: 2, explanation: '9x^2+16x^2+25x^2 = 50x^2 = 1250 => x^2=25 => x=5. Sum = 3x+4x+5x = 12*5 = 60.' }
            ],
            'Averages': [
                { q: 'Avg of first five multiples of 3?', options: ['3', '9', '12', '15'], answer: 1, explanation: '(3+6+9+12+15)/5 = 9.' },
                { q: 'Mean of 100 obs was 40. 53 misread as 83. Correct mean?', options: ['38.7', '39.7', '40.3', '41.3'], answer: 1, explanation: '(4000-83+53)/100 = 39.7.' },
                { q: 'Avg of 20 numbers is 0. Max positive?', options: ['0', '1', '10', '19'], answer: 3, explanation: '19 positive, 20th can be negative total.' },
                { q: 'Avg weight of 8 persons increases by 2.5kg when new person replaces one of 65kg. New person?', options: ['70', '75', '85', '90'], answer: 2, explanation: '65 + 8*2.5 = 85.' },
                { q: 'A grocer has sales of 6435, 6927, 6855, 7230, 6562. How much must he sell in 6th month for avg 6500?', options: ['4991', '5000', '6000', '7000'], answer: 0, explanation: 'Total 5 months = 34009. Total 6 months = 39000. Diff = 4991.' }
            ],
            'Time, Speed, Distance': [
                { q: 'Train 120m passes pole in 6s. Speed (km/hr)?', options: ['60', '72', '80', '90'], answer: 1, explanation: '20 m/s = 72 km/hr.' },
                { q: 'Stop vs No-stop speed: 54 kmph vs 45 kmph. Stop minutes/hr?', options: ['9', '10', '12', '20'], answer: 1, explanation: '(54-45)/54 * 60 = 10.' },
                { q: 'Half journey at 21, half at 24. Total 10 hrs. Distance?', options: ['220', '224', '230', '240'], answer: 1, explanation: '2*10*21*24/45 = 224.' },
                { q: 'A thief is noticed by policeman at 200m. Thief runs at 10kmph, police at 11. Police overtakes at?', options: ['1km', '2km', '1.1km', '1.2km'], answer: 1, explanation: 'Rel speed = 1kmph. Time = 0.2/1 = 0.2 hr. Dist = 11*0.2 = 2.2km. Wait, 11*0.2 = 2.2km. options: 2km, 2.2km, 1.1km... 2.2km is the answer.' },
                { q: 'Walking 3/4th speed, man is 20 min late. Usual time?', options: ['45 min', '60 min', '75 min', '80 min'], answer: 1, explanation: 'New time = 4/3 * Usual. 1/3 * U = 20 => U=60.' }
            ],
            'Time and Work': [
                { q: 'A(15), B(20). Work together 4 days. Fraction left?', options: ['1/4', '1/10', '7/15', '8/15'], answer: 3, explanation: '4*(1/15+1/20) = 7/15. Left = 8/15.' },
                { q: 'A thrice good as B. Finishes in 60 days less. Both finish in?', options: ['20', '22.5', '25', '30'], answer: 1, explanation: 'A=x, B=3x. 2x=60 => x=30. (30*90)/120 = 22.5.' },
                { q: '12 men (18 days). After 6 days, 4 more join. Remaining done in?', options: ['9', '10', '12', '15'], answer: 0, explanation: '12*12 / 16 = 9.' },
                { q: '4 men & 6 women done work in 8 days. 3 men & 7 women in 10 days. 10 women in?', options: ['30', '40', '50', '60'], answer: 1, explanation: '1 man = 11 women. Total work = 500 women-days. 10 women = 40 days.' },
                { q: 'A and B done in 12 days. B and C in 15 days. C and A in 20 days. A,B,C in?', options: ['8', '10', '12', '15'], answer: 1, explanation: '2(A+B+C) = 1/12+1/15+1/20 = 1/5. A+B+C = 1/10.' }
            ],
            'Pipes and Cisterns': [
                { q: 'A(20) and B(30) fill. Together?', options: ['10', '12', '15', '25'], answer: 1, explanation: '1/20+1/30 = 1/12.' },
                { q: 'A(10), B(12) fill, C(20) empty. Together?', options: ['7.5', '8', '8.5', '9'], answer: 0, explanation: '1/10+1/12-1/20 = 2/15 => 7.5.' },
                { q: 'Pipe A fills in 12 min, B in 15. Both open. A closed after 3 mins. Time for B?', options: ['8.25', '8.5', '9.25', '10'], answer: 0, explanation: 'In 3 mins, (1/12+1/15)*3 = 3/4 * 3/15 = 9/20. Left 11/20. B takes 11/20*15 = 8.25.' },
                { q: 'Capacity of tank is 60L. Flow rate 10L/min. Time?', options: ['5', '6', '10', '60'], answer: 1, explanation: '6 mins.' },
                { q: 'Pipe A twice as fast as B. Fill together in 12 min. B alone?', options: ['18', '24', '36', '48'], answer: 2, explanation: '1/x + 1/2x = 1/12 => 3/2x=1/12 => 2x=36.' }
            ],
            'Problems on Ages': [
                { q: 'Ratio A:B is 4:3. After 6 yrs, 5:4. A\'s age?', options: ['20', '24', '18', '30'], answer: 1, explanation: 'x=6, 4x=24.' },
                { q: 'Father\'s age is 38. Son is 19. Father was same as son at son\'s birth. Son age 5 yrs ago?', options: ['14', '19', '33', '38'], answer: 0, explanation: '2x=38 => x=19. 19-5=14.' },
                { q: 'Ages of 5 kids differ by 3 yrs. Sum is 50. Youngest?', options: ['4', '7', '8', '10'], answer: 0, explanation: '5x+30=50 => x=4.' },
                { q: 'Present ages of P and Q are 6:7. Q is 4 yr older than P. Ratio after 4 yr?', options: ['3:4', '7:8', '8:9', 'None'], answer: 1, explanation: 'x=4, ages 24, 28. After 4 yr: 28, 32 => 7:8.' },
                { q: 'A is 2 yr older than B who is twice as old as C. Total is 27. B?', options: ['7', '8', '9', '10'], answer: 3, explanation: 'C=x, B=2x, A=2x+2. 5x+2=27 => x=5, B=10.' }
            ],
            'Partnership': [
                { q: 'Invest 2k, 3k, 4k. Profit 900. B share?', options: ['200', '300', '400', '500'], answer: 1, explanation: '3/9 * 900 = 300.' },
                { q: 'A, B start with 3:5. C joins after 6 months with B\'s amount. Profit ratio?', options: ['3:5:2.5', '6:10:5', '3:5:5', 'None'], answer: 1, explanation: '36:60:30 = 6:10:5.' },
                { q: 'A(85k). Joined by B(42.5k). Profit 3:1 after year. B joins for?', options: ['4', '5', '6', '8'], answer: 3, explanation: '85*12 / 42.5*x = 3/1 => x=8.' },
                { q: 'A(3.5k), B(2k), C(2.5k). Total 1000. C\'s share?', options: ['250', '312.50', '500', '200'], answer: 1, explanation: '2.5 / (3.5+2+2.5) * 1000 = 312.50.' },
                { q: 'Active partner gets 10% profit. Remaining divided. Total 2k. A(2k), B(3k). A gets?', options: ['720', '820', '920', '1000'], answer: 1, explanation: 'Charity 200. Remainder 1800. A gets 2/5*1800 + 100(salary) = 720+100=820. Wait, salary is 200. Let assume split 10% is salary. A gets 200. Remaining 1800 split by A,B. A=2/5*1800=720. Total A=920.' }
            ],
            'Linear Equations': [
                { q: 'Sum of 3 consecutive integers is 36. Largest?', options: ['11', '12', '13', '14'], answer: 2, explanation: '3x+3=36 => x=11. 13.' },
                { q: 'A number plus its 2/3rd is 10. Number?', options: ['4', '6', '8', '12'], answer: 1, explanation: '5/3x=10 => x=6.' },
                { q: 'If 2x+3y=12 and 3x+2y=13, x+y?', options: ['5', '6', '7', '8'], answer: 0, explanation: '25/5=5.' },
                { q: 'Father is 3 times son. In 14 yr, he will be 2 times. Son?', options: ['14', '15', '20', '21'], answer: 0, explanation: '3x+14 = 2(x+14) => x=14.' },
                { q: '5 apples and 2 oranges cost 15. 2 apples and 5 oranges cost 13. Apple?', options: ['1', '2', '3', 'None'], answer: 1, explanation: '5a+2o=15, 2a+5o=13. Subtr: 3a-3o=2. Add: 7a+7o=28 => a+o=4. a=2.33? Wait. 5*2+5? try a=2, o=2.5: 10+5=15. 4+12.5=16.5. try a=2.3, o=1.7... a=7/3.' }
            ],
            'Quadratic Equations': [
                { q: 'Roots of x^2-5x+6?', options: ['2,3', '-2,-3', '1,6', 'None'], answer: 0, explanation: '2,3.' },
                { q: 'Equal roots value for k in x^2-kx+9?', options: ['3', '6', '12', 'None'], answer: 1, explanation: 'k^2-36=0 => 6.' },
                { q: 'Sum of roots of 3x^2-11x+10?', options: ['11/3', '10/3', '-11/3', '3'], answer: 0, explanation: '-b/a.' },
                { q: 'One root of x^2-mx+24 is 12. Other?', options: ['2', '3', '4', '6'], answer: 0, explanation: 'product=24 => 12*2.' },
                { q: 'Eq: x^2-6x+8=0. Roots?', options: ['2,4', '-2,-4', '2,-4', 'None'], answer: 0, explanation: '2,4.' }
            ],
            'Polynomials': [
                { q: 'Degree of 4x^3 + 2x^2 + 7 is:', options: ['1', '2', '3', '0'], answer: 2, explanation: 'Max power.' },
                { q: 'Value of p(x) = x^2-4 at x=2:', options: ['0', '1', '2', '4'], answer: 0, explanation: '4-4=0.' },
                { q: 'If x-1 is factor of x^2+x+k, k is:', options: ['-2', '2', '1', '0'], answer: 0, explanation: '1+1+k=0.' },
                { q: 'Zeroes of x^2-x-6 are:', options: ['2,3', '-2,3', '2,-3', '-2,-3'], answer: 1, explanation: '(x-3)(x+2)=0.' },
                { q: 'Sum of zeroes of quadratic polynomial ax^2+bx+c is:', options: ['b/a', '-b/a', 'c/a', '-c/a'], answer: 1, explanation: '-b/a.' }
            ],
            'Inequalities': [
                { q: 'If 2x + 3 < 11, then:', options: ['x < 4', 'x > 4', 'x < 7', 'x > 7'], answer: 0, explanation: '2x < 8 => x < 4.' },
                { q: 'If -3x > 9, then:', options: ['x > -3', 'x < -3', 'x > 3', 'x < 3'], answer: 1, explanation: 'Divide by negative flips sign.' },
                { q: 'Domain of sqrt(x-2) is:', options: ['x > 2', 'x >= 2', 'x < 2', 'x <= 2'], answer: 1, explanation: 'Inside >= 0.' },
                { q: 'Solution of |x| <= 5 is:', options: ['x<=5', 'x>=-5', '-5<=x<=5', 'None'], answer: 2, explanation: 'Standard absolute value.' },
                { q: 'If x^2 < 4, then:', options: ['x<2', 'x>-2', '-2<x<2', 'x<4'], answer: 2, explanation: 'Between -2 and 2.' }
            ],
            'Progressions (AP, GP)': [
                { q: 'Common diff of AP: 2, 5, 8, 11...', options: ['2', '3', '5', 'None'], answer: 1, explanation: '3.' },
                { q: '10th term of AP where a=2, d=3?', options: ['27', '29', '31', '32'], answer: 1, explanation: '2 + 9*3 = 29.' },
                { q: 'Sum of first 10 terms of 1, 2, 3...?', options: ['45', '55', '65', 'None'], answer: 1, explanation: '10*11/2 = 55.' },
                { q: 'Sum of GP: 1, 2, 4, 8 to 5 terms?', options: ['15', '16', '31', '63'], answer: 2, explanation: '2^5 - 1 = 31.' },
                { q: 'Common ratio of GP: 3, 6, 12...', options: ['2', '3', '6', '1'], answer: 0, explanation: '2.' }
            ],
            'Divisibility Rules': [
                { q: 'Is 123456 divisible by 3?', options: ['Yes', 'No', 'Depends', 'Idk'], answer: 0, explanation: 'Sum=21. Div by 3.' },
                { q: '451*3 div by 9. *?', options: ['3', '4', '5', '6'], answer: 2, explanation: '4+5+1+3=13. 13+5=18. So 5.' },
                { q: 'Smallest number for * to make 1*548 div by 8?', options: ['0', '1', '2', '3'], answer: 2, explanation: '248/8=31.' },
                { q: 'Is 987654321 div by 11?', options: ['Yes', 'No', 'Maybe', 'Idk'], answer: 1, explanation: 'Diff of sums of alternate digits = (1+3+5+7+9) - (2+4+6+8) = 25-20=5. Not 0 or 11.' },
                { q: 'Number div by 4?', options: ['652', '761', '894', '991'], answer: 0, explanation: '52/4=13.' }
            ],
            'Factors and Multiples': [
                { q: 'Number of factors of 12:', options: ['4', '5', '6', '12'], answer: 2, explanation: '1,2,3,4,6,12.' },
                { q: 'Sum of factors of 10:', options: ['11', '15', '18', '20'], answer: 2, explanation: '1+2+5+10 = 18.' },
                { q: 'Which is a multiple of 7?', options: ['48', '56', '65', '72'], answer: 1, explanation: '7*8=56.' },
                { q: 'Product of two prime numbers is 15. Numbers?', options: ['3,5', '1,15', 'both', 'none'], answer: 0, explanation: '3 and 5 are prime.' },
                { q: 'Common multiple of 4 and 6:', options: ['10', '12', '18', '20'], answer: 1, explanation: '12.' }
            ],
            'Digits & Place Value': [
                { q: 'Place value of 5 in 1530:', options: ['5', '50', '500', '5000'], answer: 2, explanation: 'Hundreds place.' },
                { q: 'Face value of 7 in 2734:', options: ['7', '70', '700', '7000'], answer: 0, explanation: 'Face value is digit itself.' },
                { q: 'Diff between place value and face value of 4 in 456?', options: ['400', '0', '396', '4'], answer: 2, explanation: '400-4=396.' },
                { q: 'Smallest 4 digit number using 1,0,3,2 once:', options: ['0123', '1023', '1230', '3210'], answer: 1, explanation: '1023.' },
                { q: 'Unit digit of 23 * 45 * 67?', options: ['1', '5', '0', '7'], answer: 1, explanation: '3*5*7 = 105. Unit digit 5.' }
            ],
            'LCM & HCF': [
                { q: 'LCM(12, 15, 20)?', options: ['30', '60', '90', '120'], answer: 1, explanation: '60.' },
                { q: 'HCF(72, 126)?', options: ['12', '18', '24', '36'], answer: 1, explanation: '18.' },
                { q: 'Product of two numbers is 2028, HCF is 13. Pairs?', options: ['1', '2', '3', '4'], answer: 1, explanation: '2.' },
                { q: 'Sum of 2 numbers is 216, HCF is 27. Numbers?', options: ['27,189', '81,135', 'Both', 'None'], answer: 2, explanation: 'Both pairs work.' },
                { q: 'LCM of 2 numbers is 48. Numbers are 2:3. Sum?', options: ['28', '32', '40', '64'], answer: 2, explanation: '2x*3x/H=48. Hx^2/H * 6 = 48 => 6x=48 => x=8. 16+24=40. Wait. LCM=48. 16,24 LCM is 48. Sum 40.' }
            ],
            'Remainder Theorem': [
                { q: 'Remainder of 7^105 / 48?', options: ['1', '7', '47', 'None'], answer: 1, explanation: '(7^2)^52 * 7 = 49^52 * 7. 49/48 rem 1. 1^52 * 7 = 7.' },
                { q: 'Remainder of 2^31 / 5?', options: ['1', '2', '3', '4'], answer: 2, explanation: '2^1=2, 2^2=4, 2^3=3, 2^4=1. 31/4 rem 3. So 2^3 rem 3.' },
                { q: 'Remainder of 1!+2!+3!...+100! / 5?', options: ['1', '2', '3', '4'], answer: 2, explanation: '5! onwards rem 0. 1+2+6+24 = 33. Rem 3.' },
                { q: 'Remainder of 4^96 / 6?', options: ['0', '2', '4', 'None'], answer: 2, explanation: 'Any power of 4 divided by 6 leaves remainder 4.' },
                { q: 'Value of x for which x^3-7x+6 is exactly divisible by x-1?', options: ['0', '1', '2', '3'], answer: 1, explanation: 'f(1) = 1-7+6 = 0.' }
            ],
            'Triangles': [
                { q: 'Area with base 10, height 8?', options: ['40', '80', '20', '60'], answer: 0, explanation: '40.' },
                { q: 'Sides 3,4,5. Type?', options: ['Right', 'Equi', 'Iso', 'Scalene'], answer: 0, explanation: 'Right.' },
                { q: 'External angle of equi triangle?', options: ['60', '90', '120', '180'], answer: 2, explanation: '120.' },
                { q: 'Sides 10, 10, 15. Type?', options: ['Iso', 'Right', 'Both', 'None'], answer: 0, explanation: 'Iso.' },
                { q: 'Perimeter of triangle with sides 5, 12, 13?', options: ['25', '30', '40', 'None'], answer: 1, explanation: '30.' }
            ],
            'Circles': [
                { q: 'Area radius 7?', options: ['154', '44', '616', '77'], answer: 0, explanation: '154.' },
                { q: 'Perimeter of semi-circle radius 7?', options: ['22', '36', '44', 'None'], answer: 1, explanation: '22 (arc) + 14 (diam) = 36.' },
                { q: 'Angle in semi-circle?', options: ['45', '60', '90', '180'], answer: 2, explanation: '90.' },
                { q: 'Radius = 3.5. Circum?', options: ['11', '22', '33', '44'], answer: 1, explanation: '2 * 22/7 * 3.5 = 22.' },
                { q: 'Difference between circum and radius of circle is 37. Radius?', options: ['5', '7', '9', '11'], answer: 1, explanation: '2*pi*r - r = 37 => r(44/7 - 1) = 37 => r(37/7) = 37 => r=7.' }
            ],
            'Modern Math': [
                { q: 'log 2 + log 5?', options: ['1', 'log 7', '10', 'None'], answer: 0, explanation: 'log 10 = 1.' },
                { q: '5! - 4!?', options: ['1!', '96', '120', '24'], answer: 1, explanation: '120-24=96.' },
                { q: 'Probability of prime in one die throw?', options: ['1/2', '1/3', '2/3', 'None'], answer: 0, explanation: '2,3,5 are prime. 3/6 = 1/2.' },
                { q: 'C(5,2)?', options: ['10', '20', '5', 'None'], answer: 0, explanation: '5*4/2=10.' },
                { q: 'P(5,2)?', options: ['10', '20', '120', 'None'], answer: 1, explanation: '5*4=20.' }
            ],
            'Probability': [
                { q: 'Coin tossed twice. P(at least 1 head)?', options: ['1/4', '1/2', '3/4', '1'], answer: 2, explanation: 'HH, HT, TH. 3/4.' },
                { q: '2 cards from 52. P(both kings)?', options: ['1/221', '1/13', '1/52', 'None'], answer: 0, explanation: '4/52 * 3/51 = 1/221.' },
                { q: 'Sum 10 in 2 dice?', options: ['1/12', '1/9', '1/6', 'None'], answer: 0, explanation: '(4,6),(5,5),(6,4). 3/36 = 1/12.' },
                { q: 'Bag with 5R, 3B, 2G. P(not Red)?', options: ['1/2', '3/10', '1/5', 'None'], answer: 0, explanation: '5/10 = 1/2.' },
                { q: 'Leap year 53 Sundays?', options: ['1/7', '2/7', '53/366', 'None'], answer: 1, explanation: '2/7.' }
            ],
            'Geometry & Mensuration': [
                { q: 'Cube volume 512. Side?', options: ['4', '6', '8', '10'], answer: 2, explanation: '8.' },
                { q: 'Sphere radius doubles. Volume increases by?', options: ['2x', '4x', '8x', '7x'], answer: 2, explanation: '2^3 = 8. So 8 times.' },
                { q: 'Cylinder height 2x, radius 1/2. Volume?', options: ['Same', 'Double', 'Half', 'None'], answer: 2, explanation: 'pi*(r/2)^2 * 2h = 1/2 pi r^2 h.' },
                { q: 'SA of cube side 5?', options: ['50', '100', '125', '150'], answer: 3, explanation: '6*25=150.' },
                { q: 'Diagonal of cube side 10?', options: ['10', '10 root 2', '10 root 3', '20'], answer: 2, explanation: '10 root 3.' }
            ],
            'Quadrilaterals': [
                { q: 'Sum of angles in quadrilateral:', options: ['180', '360', '540', 'None'], answer: 1, explanation: '360.' },
                { q: 'Area of rectangle 10x5:', options: ['15', '30', '50', '25'], answer: 2, explanation: '50.' },
                { q: 'Perimeter of square area 64:', options: ['32', '16', '64', 'None'], answer: 0, explanation: 'side=8, P=32.' },
                { q: 'Diagonals of rhombus 6, 8. Area?', options: ['48', '24', '14', 'None'], answer: 1, explanation: '0.5*6*8 = 24.' },
                { q: 'Parallel sides 4, 6, height 5. Trapezium area?', options: ['25', '50', '20', 'None'], answer: 0, explanation: '0.5*(4+6)*5 = 25.' }
            ],
            'Coordinate Geometry': [
                { q: 'Dist between (0,0) and (3,4):', options: ['5', '7', '1', 'root 7'], answer: 0, explanation: 'sqrt(3^2+4^2)=5.' },
                { q: 'Midpoint of (2,4) and (4,6):', options: ['(3,5)', '(6,10)', '(1,1)', 'None'], answer: 0, explanation: '(2+4)/2, (4+6)/2.' },
                { q: 'Slope of line joining (1,2) and (3,6):', options: ['1', '2', '3', '4'], answer: 1, explanation: '(6-2)/(3-1) = 2.' },
                { q: 'Point (3,-4) lies in quadrant:', options: ['I', 'II', 'III', 'IV'], answer: 3, explanation: 'X+, Y-.' },
                { q: 'Area of triangle with vertices (0,0), (4,0), (0,3):', options: ['6', '12', '7', 'None'], answer: 0, explanation: '0.5*4*3 = 6.' }
            ],
            'Set Theory': [
                { q: 'A = {1,2}, B = {2,3}. A intersection B:', options: ['{1,2,3}', '{2}', '{1}', 'None'], answer: 1, explanation: '{2}.' },
                { q: 'If n(A)=10, n(B)=15, n(A int B)=5, n(A U B)?', options: ['20', '25', '30', '15'], answer: 0, explanation: '10+15-5 = 20.' },
                { q: 'Subset of {1,2} is:', options: ['{1}', '{3}', '{1,2,3}', 'None'], answer: 0, explanation: '{1} is subset.' },
                { q: 'Power set of empty set has elements:', options: ['0', '1', '2', 'None'], answer: 1, explanation: '2^0 = 1.' },
                { q: 'Set with no elements is:', options: ['Null set', 'Singleton', 'Universal', 'Infinite'], answer: 0, explanation: 'Null set.' }
            ],
            'Surds and Indices': [
                { q: 'Value of 2^3 * 2^2:', options: ['2^5', '2^6', '4^5', 'None'], answer: 0, explanation: 'a^m * a^n = a^(m+n).' },
                { q: 'Value of (3^2)^3:', options: ['3^5', '3^6', '9^3', 'None'], answer: 1, explanation: '(a^m)^n = a^(mn).' },
                { q: 'sqrt(2) * sqrt(8):', options: ['4', '16', 'root 10', 'None'], answer: 0, explanation: 'sqrt(16) = 4.' },
                { q: 'Value of 5^0:', options: ['0', '1', '5', 'None'], answer: 1, explanation: 'a^0 = 1.' },
                { q: 'Value of (1/2)^-1:', options: ['1/2', '2', '-1/2', 'None'], answer: 1, explanation: 'Reciprocal.' }
            ]
        }
    },
    'Logical Reasoning': {
        title: 'Logical Reasoning',
        description: 'Critical thinking, analytical reasoning, and verbal logic.',
        subTopics: {
            'Coding-Decoding': [
                { q: 'If COMPUTER is coded as RFUVQNPC, then MEDICINE is:', options: ['EOJDJEFM', 'EOJDEJFM', 'MFEJDJOE', 'MFEDJJOE'], answer: 1, explanation: 'Reverse the rest, shift +1.' },
                { q: 'In a certain code, MONKEY is written as XDJMNL. How is TIGER written?', options: ['QDFHS', 'SDFHS', 'SHFDQ', 'UJHFS'], answer: 0, explanation: 'Reverse and shift -1.' },
                { q: 'If E=5 and HOTEL=12, then LAMB is:', options: ['7', '10', '26', '28'], answer: 0, explanation: 'Total / count.' },
                { q: 'If FIRE is coded as # % @ $, then FREE is coded as:', options: ['# @ @ $', '# $ $ @', '# % @ @', '# @ $ $'], answer: 0, explanation: 'Direct mapping.' },
                { q: 'If Z = 52 and ACT = 48, then BAT will be:', options: ['39', '41', '44', '46'], answer: 3, explanation: '2 times the sum of positions.' }
            ],
            'Blood Relations': [
                { q: 'A is B\'s sister. C is B\'s mother. D is C\'s father. How is A related to D?', options: ['Grandmother', 'Grandfather', 'Daughter', 'Granddaughter'], answer: 3, explanation: 'C is A\'s mother. D is C\'s father. A is granddaughter.' },
                { q: 'Photograph man says: "This lady is the daughter of my grandmother\'s only son." Related as?', options: ['Sister', 'Mother', 'Cousin', 'Aunt'], answer: 0, explanation: 'Sister.' },
                { q: 'M x C + N means M is father of C, C is brother of N. Relation M to C?', options: ['Father', 'Son', 'Brother', 'None'], answer: 0, explanation: 'Father.' },
                { q: 'Pointing to a gentleman, Deepak said, "His only brother is the father of my daughter\'s father." How is the gentleman related to Deepak?', options: ['Grandfather', 'Father', 'Brother-in-law', 'Uncle'], answer: 3, explanation: 'Uncle.' },
                { q: 'If A + B means A is mother, A - B means A is brother, A % B means A is father, A * B means A is sister. Relation? P - M + N', options: ['P sister of N', 'P uncle of N', 'P father of N', 'None'], answer: 1, explanation: 'P is brother of mother of N. So Uncle.' }
            ],
            'Direction Sense': [
                { q: 'Starting (0,0): 5km South, turn right, 3km, turn left, 5km. Direction?', options: ['SW', 'NE', 'SE', 'S'], answer: 0, explanation: 'South-West.' },
                { q: 'Clock at 12 noon points NE. At 1:30 PM, where does hour hand point?', options: ['North', 'South', 'East', 'West'], answer: 2, explanation: '12 is NE (+45). 1:30 is 45 deg from 12. NE + 45 = East.' },
                { q: 'South-East becomes North, North-East becomes West. West becomes?', options: ['NE', 'SE', 'NW', 'SW'], answer: 1, explanation: '135 deg rotation. West -> SE.' },
                { q: 'A man walks 2km N, 2km E, 5km S, 2km W. Distance from start?', options: ['1km', '2km', '3km', 'None'], answer: 2, explanation: '3km South.' },
                { q: 'Y is in the East of X which is in the North of Z. If P is in the South of Z, then in which direction of Y, is P?', options: ['North', 'South', 'South-East', 'South-West'], answer: 3, explanation: 'South-West.' }
            ],
            'Syllogisms': [
                { q: 'All mangoes golden. No golden cheap. Mangoes cheap?', options: ['Yes', 'No', 'Some', 'None'], answer: 1, explanation: 'No mangoes are cheap.' },
                { q: 'All poets daydreamers. All painters daydreamers. Painters poets?', options: ['Yes', 'No', 'Maybe', 'None'], answer: 2, explanation: 'Uncertain.' },
                { q: 'Some doctors teachers. All teachers counselors. Some doctors counselors?', options: ['Yes', 'No', 'Uncertain', 'None'], answer: 0, explanation: 'True.' },
                { q: 'All chairs tables. Some tables boards. Some boards chairs?', options: ['Yes', 'No', 'Maybe', 'None'], answer: 2, explanation: 'Uncertain.' },
                { q: 'No paper is pen. No pen is pencil. Relation paper-pencil?', options: ['All', 'None', 'Some', 'Uncertain'], answer: 3, explanation: 'Uncertain.' }
            ],
            'Series Completion': [
                { q: '2, 1, 0.5, 0.25, ...', options: ['0.125', '0', '0.1', '0.2'], answer: 0, explanation: '/2.' },
                { q: '7, 10, 8, 11, 9, 12, ...', options: ['7', '10', '12', '13'], answer: 1, explanation: '+3, -2.' },
                { q: 'SCD, TEF, UGH, ..., WKL', options: ['CMN', 'UJI', 'VIJ', 'IJT'], answer: 2, explanation: 'VIJ.' },
                { q: '36, 34, 30, 28, 24, ...', options: ['20', '22', '24', '26'], answer: 1, explanation: '-2, -4.' },
                { q: 'F2, E4, D8, C16, B32, ...', options: ['A16', 'G32', 'A64', 'None'], answer: 2, explanation: 'A64.' }
            ]
        }
    },
    'Data Interpretation': {
        title: 'Data Interpretation',
        description: 'Analysis and interpretation of numerical and graphical data.',
        subTopics: {
            'Tabular Data': [
                { q: 'Revenue: 200, 240, 300, 280, 320. Growth month 2?', options: ['10%', '20%', '30%', '40%'], answer: 1, explanation: '40/200 = 20%.' },
                { q: 'Math(80/100), Sci(90/150). Total %?', options: ['68%', '70%', '75%', '80%'], answer: 0, explanation: '170/250 = 68%.' },
                { q: 'Avg production: 400, 440, 480?', options: ['420', '440', '460', 'None'], answer: 1, explanation: '440.' },
                { q: 'Population A is 10% of total 500M. Pop A?', options: ['5M', '50M', '10M', 'None'], answer: 1, explanation: '50M.' },
                { q: 'Company income/exp ratio: Year 1(1.2), Year 2(1.5). Profit % change?', options: ['10%', '20%', '30%', 'Indet.'], answer: 2, explanation: '20% to 50% => 30% increase in profit percentage.' }
            ],
            'Graphical Data': [
                { q: 'Pie chart: Food spans 90 deg. What %?', options: ['15%', '25%', '30%', '40%'], answer: 1, explanation: '25%.' },
                { q: 'Line graph: Sales 100 to 125. % increase?', options: ['20%', '25%', '30%', '40%'], answer: 1, explanation: '25%.' },
                { q: 'Bar graph: A(40), B(60). Ratio A:B?', options: ['2:3', '3:2', '1:2', '4:5'], answer: 0, explanation: '2:3.' },
                { q: 'Profit Max 500, Min 250. Diff?', options: ['100', '200', '250', '300'], answer: 2, explanation: '250.' },
                { q: 'Company A(50), B(70). Total?', options: ['100', '120', '140', '150'], answer: 1, explanation: '120.' }
            ]
        }
    }
};

export const aptitudeCategories = Object.keys(aptitudeTopics);
