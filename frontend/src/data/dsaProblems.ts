export interface DSAProblem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    description: string;
    examples: { input: string; output: string; explanation?: string }[];
    constraints: string[];
    starterCode?: Record<string, string>;
    functionName?: string;
    testCases?: { input: any; expected: any; label?: string }[];
}

export const dsaCategories = [
    "Basics of DSA", "Arrays", "Strings", "Linked List", 
    "Stack & Queue", "Hashing", "Searching & Sorting", 
    "Trees", "Graphs", "Greedy Algorithms", 
    "Dynamic Programming (DP)", "Advanced Topics"
];

export const dsaProblems: Record<string, DSAProblem[]> = {
    "Basics of DSA": [
        {
            id: "basics-1",
            title: "Sum of Natural Numbers",
            difficulty: "Easy",
            category: "Basics of DSA",
            description: "Given an integer N, your task is to calculate the sum of all natural numbers from 1 to N.\n\nNatural numbers are positive integers (1, 2, 3, ...).\n\nExample:\nIf N = 3, the sum is 1 + 2 + 3 = 6.",
            examples: [
                { input: "N = 5", output: "15", explanation: "1 + 2 + 3 + 4 + 5 = 15" },
                { input: "N = 10", output: "55", explanation: "The sum of first 10 numbers is 55." }
            ],
            constraints: ["1 <= N <= 10^5"]
        },
        {
            id: "basics-2",
            title: "Factorial of a Number",
            difficulty: "Easy",
            category: "Basics of DSA",
            description: "Given a non-negative integer N, find the factorial of N.\n\nThe factorial of a non-negative integer n, denoted by n!, is the product of all positive integers less than or equal to n. \n\nNote: 0! is defined as 1.",
            examples: [
                { input: "N = 5", output: "120", explanation: "5! = 5 * 4 * 3 * 2 * 1 = 120" },
                { input: "N = 0", output: "1", explanation: "By definition, 0! = 1" }
            ],
            constraints: ["0 <= N <= 18"]
        },
        { 
            id: "basics-3", 
            title: "Fibonacci Number", 
            difficulty: "Easy", 
            category: "Basics of DSA", 
            description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nF(0) = 0, F(1) = 1\nF(n) = F(n - 1) + F(n - 2), for n > 1.\n\nGiven n, calculate F(n).", 
            examples: [
                { input: "n = 2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1" },
                { input: "n = 3", output: "2", explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2" },
                { input: "n = 4", output: "3", explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3" }
            ], 
            constraints: ["0 <= n <= 30"] 
        },
        { 
            id: "basics-4", 
            title: "Power of Two", 
            difficulty: "Easy", 
            category: "Basics of DSA", 
            description: "Given an integer n, return true if it is a power of two. Otherwise, return false.\n\nAn integer n is a power of two, if there exists an integer x such that n == 2^x.", 
            examples: [
                { input: "n = 1", output: "true", explanation: "2^0 = 1" },
                { input: "n = 16", output: "true", explanation: "2^4 = 16" },
                { input: "n = 3", output: "false" }
            ], 
            constraints: ["-2^31 <= n <= 2^31 - 1"] 
        },
        { 
            id: "basics-5", 
            title: "Prime Number Check", 
            difficulty: "Easy", 
            category: "Basics of DSA", 
            description: "A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers.\n\nGiven an integer N, determine if it is a prime number.", 
            examples: [
                { input: "N = 7", output: "true", explanation: "7 is only divisible by 1 and 7." },
                { input: "N = 10", output: "false", explanation: "10 is divisible by 2 and 5." }
            ], 
            constraints: ["1 <= N <= 10^9"] 
        },
        { 
            id: "basics-6", 
            title: "GCD of Two Numbers", 
            difficulty: "Easy", 
            category: "Basics of DSA", 
            description: "The Greatest Common Divisor (GCD) of two non-zero integers is the largest positive integer that divides both numbers without a remainder.\n\nImplement a function to find the GCD of two integers A and B.", 
            examples: [
                { input: "A = 12, B = 18", output: "6", explanation: "Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. Common: 1,2,3,6. Largest: 6." }
            ], 
            constraints: ["1 <= A, B <= 10^9"] 
        },
        { 
            id: "basics-7", 
            title: "Reverse a Number", 
            difficulty: "Easy", 
            category: "Basics of DSA", 
            description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.\n\nAssume the environment does not allow you to store 64-bit integers (signed or unsigned).", 
            examples: [
                { input: "x = 123", output: "321" },
                { input: "x = -123", output: "-321" },
                { input: "x = 120", output: "21" }
            ], 
            constraints: ["-2^31 <= x <= 2^31 - 1"] 
        },
        { 
            id: "basics-8", 
            title: "Count Digits", 
            difficulty: "Easy", 
            category: "Basics of DSA", 
            description: "Given a positive integer N, count the number of digits present in N.", 
            examples: [
                { input: "N = 12345", output: "5" },
                { input: "N = 7", output: "1" }
            ], 
            constraints: ["1 <= N <= 10^18"] 
        },
        { 
            id: "basics-9", 
            title: "Palindrome Number", 
            difficulty: "Easy", 
            category: "Basics of DSA", 
            description: "Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same backward as forward. For example, 121 is a palindrome while 123 is not.", 
            examples: [
                { input: "x = 121", output: "true" },
                { input: "x = -121", output: "false", explanation: "From left to right, it reads -121. From right to left, it becomes 121-." }
            ], 
            constraints: ["-2^31 <= x <= 2^31 - 1"] 
        },
        { 
            id: "basics-10", 
            title: "Find Peak Element (Basic)", 
            difficulty: "Easy", 
            category: "Basics of DSA", 
            description: "A peak element is an element that is strictly greater than its neighbors.\n\nGiven an integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.\n\nYou may imagine that nums[-1] = nums[n] = -∞.", 
            examples: [
                { input: "nums = [1,2,3,1]", output: "2", explanation: "3 is a peak element and your function should return the index number 2." }
            ], 
            constraints: ["1 <= nums.length <= 1000", "-2^31 <= nums[i] <= 2^31 - 1"] 
        },
    ],
    "Arrays": [
        { 
            id: "arrays-1", 
            title: "Two Sum", 
            difficulty: "Easy", 
            category: "Arrays", 
            description: "Find two numbers in an array that add up to a specific target.", 
            examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }], 
            constraints: ["2 <= nums.length <= 10^4"],
            functionName: "twoSum",
            testCases: [
                { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1], label: "Short Array" },
                { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2], label: "Target doesn't include index 0" },
                { input: { nums: [3, 3], target: 6 }, expected: [0, 1], label: "Duplicate Numbers" }
            ],
            starterCode: {
                cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
                python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        ",
                java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
                javascript: "\nvar twoSum = function(nums, target) {\n    \n};"
            }
        },
        { 
            id: "arrays-2", 
            title: "Maximum Subarray (Kadane's)", 
            difficulty: "Medium", 
            category: "Arrays", 
            description: "Find the contiguous subarray with the largest sum.", 
            examples: [{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6." }], 
            constraints: ["1 <= nums.length <= 10^5"],
            functionName: "maxSubArray",
            testCases: [
                { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6, label: "Mixed Numbers" },
                { input: { nums: [1] }, expected: 1, label: "Single Element" },
                { input: { nums: [5, 4, -1, 7, 8] }, expected: 23, label: "All Positive" }
            ],
            starterCode: {
                cpp: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};",
                python: "class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        ",
                java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}",
                javascript: "\nvar maxSubArray = function(nums) {\n    \n};"
            }
        },
        { 
            id: "arrays-3", 
            title: "Contains Duplicate", 
            difficulty: "Easy", 
            category: "Arrays", 
            description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.", 
            examples: [
                { input: "nums = [1,2,3,1]", output: "true" },
                { input: "nums = [1,2,3,4]", output: "false" },
                { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true" }
            ], 
            constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"], 
            functionName: "containsDuplicate" 
        },
        { 
            id: "arrays-4", 
            title: "Product of Array Except Self", 
            difficulty: "Medium", 
            category: "Arrays", 
            description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.", 
            examples: [
                { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "answer[0] = 2*3*4=24, answer[1]=1*3*4=12..." }
            ], 
            constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"], 
            functionName: "productExceptSelf" 
        },
        { 
            id: "arrays-5", 
            title: "Maximum Product Subarray", 
            difficulty: "Medium", 
            category: "Arrays", 
            description: "Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.\n\nThe test cases are generated so that the answer will fit in a 32-bit integer.\n\nA subarray is a contiguous subsequence of the array.", 
            examples: [
                { input: "nums = [2,3,-2,4]", output: "6", explanation: "[2,3] has the largest product 6." },
                { input: "nums = [-2,0,-1]", output: "0", explanation: "The result cannot be 2, because [-2,-1] is not a subarray." }
            ], 
            constraints: ["1 <= nums.length <= 2 * 10^4", "-10 <= nums[i] <= 10"], 
            functionName: "maxProduct" 
        },
        { 
            id: "arrays-6", 
            title: "Find Minimum in Rotated Sorted Array", 
            difficulty: "Medium", 
            category: "Arrays", 
            description: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:\n\n[4,5,6,7,0,1,2] if it was rotated 4 times.\n[0,1,2,4,5,6,7] if it was rotated 7 times.\n\nNotice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].\n\nGiven the sorted rotated array nums of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in O(log n) time.", 
            examples: [
                { input: "nums = [3,4,5,1,2]", output: "1" },
                { input: "nums = [4,5,6,7,0,1,2]", output: "0" }
            ], 
            constraints: ["n == nums.length", "1 <= n <= 5000", "-5000 <= nums[i] <= 5000"], 
            functionName: "findMin" 
        },
        { 
            id: "arrays-7", 
            title: "Search in Rotated Sorted Array", 
            difficulty: "Medium", 
            category: "Arrays", 
            description: "There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.", 
            examples: [
                { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
                { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" }
            ], 
            constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values are unique."], 
            functionName: "search" 
        },
        { 
            id: "arrays-8", 
            title: "3Sum", 
            difficulty: "Medium", 
            category: "Arrays", 
            description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.", 
            examples: [
                { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
                { input: "nums = [0,1,1]", output: "[]" },
                { input: "nums = [0,0,0]", output: "[[0,0,0]]" }
            ], 
            constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"], 
            functionName: "threeSum" 
        },
        { 
            id: "arrays-9", 
            title: "Container With Most Water", 
            difficulty: "Medium", 
            category: "Arrays", 
            description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nNotice that you may not slant the container.", 
            examples: [
                { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The max area is 49 (from indices 1 to 8)." }
            ], 
            constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"], 
            functionName: "maxArea" 
        },
        { 
            id: "arrays-10", 
            title: "Find All Duplicates in an Array", 
            difficulty: "Medium", 
            category: "Arrays", 
            description: "Given an integer array nums of length n where all the integers of nums are in the range [1, n] and each integer appears once or twice, return an array of all the integers that appears twice.\n\nYou must write an algorithm that runs in O(n) time and uses only constant extra space.", 
            examples: [
                { input: "nums = [4,3,2,7,8,2,3,1]", output: "[2,3]" },
                { input: "nums = [1,1,2]", output: "[1]" }
            ], 
            constraints: ["n == nums.length", "1 <= n <= 10^5", "1 <= nums[i] <= n"], 
            functionName: "findDuplicates" 
        },
    ],
    "Strings": [
        {
            id: "strings-1",
            title: "Reverse String",
            difficulty: "Easy",
            category: "Strings",
            description: "Write a function that reverses a string.",
            examples: [{ input: "s = ['h','e','l','l','o']", output: "['o','l','l','e','h']" }],
            constraints: ["1 <= s.length <= 10^5"],
            functionName: "reverseString",
            testCases: [
                { input: { s: ["h", "e", "l", "l", "o"] }, expected: ["o", "l", "l", "e", "h"], label: "hello" },
                { input: { s: ["H", "a", "n", "n", "a", "h"] }, expected: ["h", "a", "n", "n", "a", "H"], label: "Hannah" }
            ],
            starterCode: {
                cpp: "class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        \n    }\n};",
                python: "class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        ",
                java: "class Solution {\n    public void reverseString(char[] s) {\n        \n    }\n}",
                javascript: "\nvar reverseString = function(s) {\n    \n};"
            }
        },
        { 
            id: "strings-2", 
            title: "Valid Anagram", 
            difficulty: "Easy", 
            category: "Strings", 
            description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.", 
            examples: [
                { input: "s = 'anagram', t = 'nagaram'", output: "true" },
                { input: "s = 'rat', t = 'car'", output: "false" }
            ], 
            constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."], 
            functionName: "isAnagram" 
        },
        { 
            id: "strings-3", 
            title: "Longest Substring Without Repeating Characters", 
            difficulty: "Medium", 
            category: "Strings", 
            description: "Given a string s, find the length of the longest substring without repeating characters.", 
            examples: [
                { input: "s = 'abcabcbb'", output: "3", explanation: "The answer is 'abc', with the length of 3." },
                { input: "s = 'bbbbb'", output: "1", explanation: "The answer is 'b', with the length of 1." },
                { input: "s = 'pwwkew'", output: "3", explanation: "The answer is 'wke', with the length of 3. Note that the answer must be a substring, 'pwke' is a subsequence and not a substring." }
            ], 
            constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."], 
            functionName: "lengthOfLongestSubstring" 
        },
        { 
            id: "strings-4", 
            title: "Valid Palindrome", 
            difficulty: "Easy", 
            category: "Strings", 
            description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.", 
            examples: [
                { input: "s = 'A man, a plan, a canal: Panama'", output: "true", explanation: "'amanaplanacanalpanama' is a palindrome." },
                { input: "s = 'race a car'", output: "false", explanation: "'raceacar' is not a palindrome." }
            ], 
            constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."], 
            functionName: "isPalindrome" 
        },
        { 
            id: "strings-5", 
            title: "Longest Common Prefix", 
            difficulty: "Easy", 
            category: "Strings", 
            description: "Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string ''.", 
            examples: [
                { input: "strs = ['flower','flow','flight']", output: "'fl'" },
                { input: "strs = ['dog','racecar','car']", output: "''", explanation: "There is no common prefix among the input strings." }
            ], 
            constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] consists of only lowercase English letters."], 
            functionName: "longestCommonPrefix" 
        },
        { 
            id: "strings-6", 
            title: "String to Integer (atoi)", 
            difficulty: "Medium", 
            category: "Strings", 
            description: "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.\n\nThe algorithm for myAtoi(string s) is as follows:\n1. Read in and ignore any leading whitespace.\n2. Check if the next character (if not already at the end of the string) is '-' or '+'. Read this character in if it is either. This determines if the final result is negative or positive respectively. Assume the result is positive if neither is present.\n3. Read in next the characters until the next non-digit character or the end of the input is reached. The rest of the string is ignored.\n4. Convert these digits into an integer (e.g. '123' -> 123, '0032' -> 32). If no digits were read, then the integer is 0. Change the sign as necessary (from step 2).\n5. If the integer is out of the 32-bit signed integer range [-2^31, 2^31 - 1], then clamp the integer so that it remains in the range.", 
            examples: [
                { input: "s = '42'", output: "42" },
                { input: "s = '   -42'", output: "-42" },
                { input: "s = '4193 with words'", output: "4193" }
            ], 
            constraints: ["0 <= s.length <= 200", "s consists of English letters (lower-case and upper-case), digits (0-9), ' ', '+', '-', and '.'."],
            functionName: "myAtoi"
        },
        { 
            id: "strings-7", 
            title: "Implement strStr()", 
            difficulty: "Easy", 
            category: "Strings", 
            description: "Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.\n\nClarification:\nWhat should we return when needle is an empty string? This is a great question to ask during an interview.\n\nFor the purpose of this problem, we will return 0 when needle is an empty string. This is consistent to C's strstr() and Java's indexOf().", 
            examples: [
                { input: "haystack = 'hello', needle = 'll'", output: "2" },
                { input: "haystack = 'aaaaa', needle = 'bba'", output: "-1" }
            ], 
            constraints: ["0 <= haystack.length, needle.length <= 5 * 10^4", "haystack and needle consist of only lowercase English characters."],
            functionName: "strStr"
        },
        { 
            id: "strings-8", 
            title: "Group Anagrams", 
            difficulty: "Medium", 
            category: "Strings", 
            description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.", 
            examples: [
                { input: "strs = ['eat','tea','tan','ate','nat','bat']", output: "[['bat'],['nat','tan'],['ate','eat','tea']]" },
                { input: "strs = ['']", output: "[['']]" },
                { input: "strs = ['a']", output: "[['a']]" }
            ], 
            constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
            functionName: "groupAnagrams"
        },
        { 
            id: "strings-9", 
            title: "Longest Palindromic Substring", 
            difficulty: "Medium", 
            category: "Strings", 
            description: "Given a string s, return the longest palindromic substring in s.", 
            examples: [
                { input: "s = 'babad'", output: "'bab'", explanation: "'aba' is also a valid answer." },
                { input: "s = 'cbbd'", output: "'bb'" }
            ], 
            constraints: ["1 <= s.length <= 1000", "s consists of only digits and English letters."],
            functionName: "longestPalindrome"
        },
        { 
            id: "strings-10", 
            title: "Integer to Roman", 
            difficulty: "Medium", 
            category: "Strings", 
            description: "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.\n\nSymbol       Value\nI             1\nV             5\nX             10\nL             50\nC             100\nD             500\nM             1000\n\nGiven an integer, convert it to a roman numeral.", 
            examples: [
                { input: "num = 3", output: "'III'" },
                { input: "num = 58", output: "'LVIII'", explanation: "L = 50, V = 5, III = 3." }
            ], 
            constraints: ["1 <= num <= 3999"],
            functionName: "intToRoman"
        },
    ],
    "Linked List": [
        { 
            id: "ll-1", 
            title: "Reverse Linked List", 
            difficulty: "Easy", 
            category: "Linked List", 
            description: "Given the head of a singly linked list, reverse the list, and return the reversed list.", 
            examples: [
                { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
                { input: "head = [1,2]", output: "[2,1]" },
                { input: "head = []", output: "[]" }
            ], 
            constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
            functionName: "reverseList",
            testCases: [
                { input: { head: [1, 2, 3, 4, 5] }, expected: [5, 4, 3, 2, 1], label: "1-5" },
                { input: { head: [1, 2] }, expected: [2, 1], label: "Small" }
            ],
            starterCode: {
                cpp: "\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};",
                python: "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        ",
                java: "\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}",
                javascript: "\n\nvar reverseList = function(head) {\n    \n};"
            }
        },
        { 
            id: "ll-2", 
            title: "Linked List Cycle", 
            difficulty: "Easy", 
            category: "Linked List", 
            description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.\n\nReturn true if there is a cycle in the linked list. Otherwise, return false.", 
            examples: [
                { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)." }
            ], 
            constraints: ["The number of nodes in the list is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5", "pos is -1 or a valid index in the linked-list."], 
            functionName: "hasCycle" 
        },
        { 
            id: "ll-3", 
            title: "Merge Two Sorted Lists", 
            difficulty: "Easy", 
            category: "Linked List", 
            description: "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.", 
            examples: [
                { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
                { input: "list1 = [], list2 = []", output: "[]" }
            ], 
            constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100", "Both list1 and list2 are sorted in non-decreasing order."], 
            functionName: "mergeTwoLists" 
        },
        { 
            id: "ll-4", 
            title: "Remove Nth Node From End of List", 
            difficulty: "Medium", 
            category: "Linked List", 
            description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.", 
            examples: [
                { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" },
                { input: "head = [1], n = 1", output: "[]" }
            ], 
            constraints: ["The number of nodes in the list is sz.", "1 <= sz <= 30", "0 <= Node.val <= 100", "1 <= n <= sz"], 
            functionName: "removeNthFromEnd" 
        },
        { 
            id: "ll-5", 
            title: "Delete Node in a Linked List", 
            difficulty: "Easy", 
            category: "Linked List", 
            description: "There is a singly-linked list head and we want to delete a node node in it.\n\nYou are given the node to be deleted node. You will not be given access to the head of the list.\n\nAll the values of the linked list are unique, and it is guaranteed that the given node node is not the last node in the linked list.", 
            examples: [
                { input: "node = 5", output: "[4,1,9]", explanation: "You are given the second node with value 5, the linked list should become 4 -> 1 -> 9 after calling your function." }
            ], 
            constraints: ["The number of the nodes in the given list is in the range [2, 1000].", "-1000 <= Node.val <= 1000", "The value of each node in the list is unique.", "The node to be deleted is in the list and is not a tail node."], 
            functionName: "deleteNode" 
        },
        { 
            id: "ll-6", 
            title: "Intersection of Two Linked Lists", 
            difficulty: "Easy", 
            category: "Linked List", 
            description: "Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return null.", 
            examples: [
                { input: "intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3", output: "Intersected at '8'" }
            ], 
            constraints: ["The number of nodes of listA is in the m.", "The number of nodes of listB is in the n.", "1 <= m, n <= 3 * 10^4", "1 <= Node.val <= 10^9"], 
            functionName: "getIntersectionNode" 
        },
        { 
            id: "ll-7", 
            title: "Middle of the Linked List", 
            difficulty: "Easy", 
            category: "Linked List", 
            description: "Given the head of a singly linked list, return the middle node of the linked list.\n\nIf there are two middle nodes, return the second middle node.", 
            examples: [
                { input: "head = [1,2,3,4,5]", output: "[3,4,5]", explanation: "The middle node of the list is node 3." },
                { input: "head = [1,2,3,4,5,6]", output: "[4,5,6]", explanation: "Since the list has two middle nodes with values 3 and 4, we return the second one." }
            ], 
            constraints: ["The number of nodes in the list is in the range [1, 100].", "1 <= Node.val <= 100"], 
            functionName: "middleNode" 
        },
        { 
            id: "ll-8", 
            title: "Palindrome Linked List", 
            difficulty: "Easy", 
            category: "Linked List", 
            description: "Given the head of a singly linked list, return true if it is a palindrome or false otherwise.", 
            examples: [
                { input: "head = [1,2,2,1]", output: "true" },
                { input: "head = [1,2]", output: "false" }
            ], 
            constraints: ["The number of nodes in the list is in the range [1, 10^5].", "0 <= Node.val <= 9"], 
            functionName: "isPalindrome" 
        },
        { 
            id: "ll-9", 
            title: "Add Two Numbers", 
            difficulty: "Medium", 
            category: "Linked List", 
            description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.", 
            examples: [
                { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807." }
            ], 
            constraints: ["The number of nodes in each linked list is in the range [1, 100].", "0 <= Node.val <= 9", "It is guaranteed that the list represents a number that does not have leading zeros."], 
            functionName: "addTwoNumbers" 
        },
        { 
            id: "ll-10", 
            title: "Merge k Sorted Lists", 
            difficulty: "Hard", 
            category: "Linked List", 
            description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.", 
            examples: [
                { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }
            ], 
            constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500", "-10^4 <= lists[i][j] <= 10^4", "lists[i] is sorted in ascending order."], 
            functionName: "mergeKLists" 
        },
    ],
    "Stack & Queue": [
        { 
            id: "sq-1", 
            title: "Valid Parentheses", 
            difficulty: "Easy", 
            category: "Stack & Queue", 
            description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.", 
            examples: [
                { input: "s = '()'", output: "true" },
                { input: "s = '()[]{}'", output: "true" },
                { input: "s = '(]'", output: "false" }
            ], 
            constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
            functionName: "isValid"
        },
        { 
            id: "sq-2", 
            title: "Implement Queue using Stacks", 
            difficulty: "Easy", 
            category: "Stack & Queue", 
            description: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).\n\nImplement the MyQueue class:\n- void push(int x) Pushes element x to the back of the queue.\n- int pop() Removes the element from the front of the queue and returns it.\n- int peek() Returns the element at the front of the queue.\n- boolean empty() Returns true if the queue is empty, false otherwise.", 
            examples: [
                { input: "push(1); push(2); peek(); pop(); empty();", output: "void, void, 1, 1, false" }
            ], 
            constraints: ["1 <= x <= 9", "At most 100 calls will be made to push, pop, peek, and empty.", "All the calls to pop and peek are valid."],
            functionName: "MyQueue"
        },
        { 
            id: "sq-3", 
            title: "Min Stack", 
            difficulty: "Medium", 
            category: "Stack & Queue", 
            description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the MinStack class:\n- MinStack() initializes the stack object.\n- void push(int val) pushes the element val onto the stack.\n- void pop() removes the element on the top of the stack.\n- int top() gets the top element of the stack.\n- int getMin() retrieves the minimum element in the stack.", 
            examples: [
                { input: "push(-2); push(0); push(-3); getMin(); pop(); top(); getMin();", output: "void, void, void, -3, void, 0, -2" }
            ], 
            constraints: ["-2^31 <= val <= 2^31 - 1", "Methods pop, top and getMin operations will always be called on non-empty stacks.", "At most 3 * 10^4 calls will be made to push, pop, top, and getMin."],
            functionName: "MinStack"
        },
        { 
            id: "sq-4", 
            title: "Evaluate Reverse Polish Notation", 
            difficulty: "Medium", 
            category: "Stack & Queue", 
            description: "You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation.\n\nEvaluate the expression. Return an integer that represents the value of the expression.\n\nNote that:\n- The valid operators are '+', '-', '*', and '/'.\n- Each operand may be an integer or another expression.\n- The division between two integers always truncates toward zero.\n- There will not be any division by zero.\n- The input represents a valid arithmetic expression in a reverse polish notation.\n- The answer and all the intermediate calculations can be represented in a 32-bit integer.", 
            examples: [
                { input: "tokens = ['2','1','+','3','*']", output: "9", explanation: "((2 + 1) * 3) = 9" },
                { input: "tokens = ['4','13','5','/','+']", output: "6", explanation: "(4 + (13 / 5)) = 6" }
            ], 
            constraints: ["1 <= tokens.length <= 10^4", "tokens[i] is either an operator or an integer in the range [-200, 200]."],
            functionName: "evalRPN"
        },
        { 
            id: "sq-5", 
            title: "Daily Temperatures", 
            difficulty: "Medium", 
            category: "Stack & Queue", 
            description: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.", 
            examples: [
                { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" },
                { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]" }
            ], 
            constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
            functionName: "dailyTemperatures"
        },
        { 
            id: "sq-6", 
            title: "Next Greater Element I", 
            difficulty: "Easy", 
            category: "Stack & Queue", 
            description: "The next greater element of some element x in an array is the first greater element that is to the right of x in the same array.\n\nYou are given two distinct 0-indexed integer arrays nums1 and nums2, where nums1 is a subset of nums2.\n\nFor each 0 <= i < nums1.length, find the index j such that nums1[i] == nums2[j] and determine the next greater element of nums2[j] in nums2. If there is no next greater element, then the answer for this query is -1.\n\nReturn an array ans of length nums1.length such that ans[i] is the next greater element as described above.", 
            examples: [
                { input: "nums1 = [4,1,2], nums2 = [1,3,4,2]", output: "[-1,3,-1]", explanation: "For 4: no greater. For 1: 3. For 2: no greater." }
            ], 
            constraints: ["1 <= nums1.length <= nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 10^4", "All integers in nums1 and nums2 are unique.", "All the integers of nums1 also appear in nums2."],
            functionName: "nextGreaterElement"
        },
        { 
            id: "sq-7", 
            title: "Sliding Window Maximum", 
            difficulty: "Hard", 
            category: "Stack & Queue", 
            description: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.", 
            examples: [
                { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]", explanation: "Window [1,3,-1] max is 3, [3,-1,-3] max is 3, etc." }
            ], 
            constraints: ["1 <= nums.length <= 10^5", "1 <= k <= nums.length", "-10^4 <= nums[i] <= 10^4"],
            functionName: "maxSlidingWindow"
        },
        { 
            id: "sq-8", 
            title: "Decode String", 
            difficulty: "Medium", 
            category: "Stack & Queue", 
            description: "Given an encoded string, return its decoded string.\n\nThe encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is being repeated exactly k times. Note that k is guaranteed to be a positive integer.\n\nYou may assume that the input string is always valid; there are no extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, k. For example, there will not be input like 3a or 2[4].", 
            examples: [
                { input: "s = '3[a]2[bc]'", output: "'aaabcbc'" },
                { input: "s = '3[a2[c]]'", output: "'accaccacc'" }
            ], 
            constraints: ["1 <= s.length <= 30", "s consists of lowercase English letters, digits, and square brackets '[]'.", "s is guaranteed to be a valid input.", "All the integers in s are in the range [1, 300]."],
            functionName: "decodeString"
        },
        { 
            id: "sq-9", 
            title: "Largest Rectangle in Histogram", 
            difficulty: "Hard", 
            category: "Stack & Queue", 
            description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, find the area of the largest rectangle in the histogram.", 
            examples: [
                { input: "heights = [2,1,5,6,2,3]", output: "10", explanation: "The largest rectangle is formed by heights 5 and 6 with area 10." }
            ], 
            constraints: ["1 <= heights.length <= 10^5", "0 <= heights[i] <= 10^4"],
            functionName: "largestRectangleArea"
        },
        { 
            id: "sq-10", 
            title: "Simplified Path", 
            difficulty: "Medium", 
            category: "Stack & Queue", 
            description: "Given a string path, which is an absolute path (starting with a slash '/') to a file or directory in a Unix-style file system, convert it to the simplified canonical path.\n\nIn a Unix-style file system, a period '.' refers to the current directory, a double period '..' refers to the directory up a level, and any multiple consecutive slashes (i.e. '//') are treated as a single slash '/'. For this problem, any other format of periods such as '...' are treated as file/directory names.\n\nThe canonical path should have the following format:\n- The path starts with a single slash '/'.\n- Any two directories are separated by a single slash '/'.\n- The path does not end with a trailing '/'.\n- The path only contains the directories on the path from the root directory to the target file or directory (i.e., no period '.' or double period '..')", 
            examples: [
                { input: "path = '/home/'", output: "'/home'" },
                { input: "path = '/../'", output: "'/'" },
                { input: "path = '/home//foo/'", output: "'/home/foo'" }
            ], 
            constraints: ["1 <= path.length <= 3000", "path consists of English letters, digits, period '.', slash '/' or '_'.", "path is a valid absolute Unix path."],
            functionName: "simplifyPath"
        },
    ],
    "Hashing": [
        { 
            id: "h-1", 
            title: "Two Sum (Hash)", 
            difficulty: "Easy", 
            category: "Hashing", 
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.", 
            examples: [
                { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }
            ], 
            constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
            functionName: "twoSum"
        },
        { 
            id: "h-2", 
            title: "Group Anagrams", 
            difficulty: "Medium", 
            category: "Hashing", 
            description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.", 
            examples: [
                { input: "strs = ['eat','tea','tan','ate','nat','bat']", output: "[['bat'],['nat','tan'],['ate','eat','tea']]" }
            ], 
            constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
            functionName: "groupAnagrams"
        },
        { 
            id: "h-3", 
            title: "Longest Consecutive Sequence", 
            difficulty: "Medium", 
            category: "Hashing", 
            description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in O(n) time.", 
            examples: [
                { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4." }
            ], 
            constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
            functionName: "longestConsecutive"
        },
        { 
            id: "h-4", 
            title: "Top K Frequent Elements", 
            difficulty: "Medium", 
            category: "Hashing", 
            description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.", 
            examples: [
                { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" }
            ], 
            constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "k is in the range [1, the number of unique elements in the array].", "It is guaranteed that the answer is unique."],
            functionName: "topKFrequent"
        },
        { 
            id: "h-5", 
            title: "Intersection of Two Arrays", 
            difficulty: "Easy", 
            category: "Hashing", 
            description: "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.", 
            examples: [
                { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]" }
            ], 
            constraints: ["1 <= nums1.length, nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 1000"],
            functionName: "intersection"
        },
        { 
            id: "h-6", 
            title: "Subarray Sum Equals K", 
            difficulty: "Medium", 
            category: "Hashing", 
            description: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.\n\nA subarray is a contiguous non-empty sequence of elements within an array.", 
            examples: [
                { input: "nums = [1,1,1], k = 2", output: "2" }
            ], 
            constraints: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"],
            functionName: "subarraySum"
        },
        { 
            id: "h-7", 
            title: "First Unique Character in a String", 
            difficulty: "Easy", 
            category: "Hashing", 
            description: "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.", 
            examples: [
                { input: "s = 'leetcode'", output: "0" },
                { input: "s = 'loveleetcode'", output: "2" }
            ], 
            constraints: ["1 <= s.length <= 10^5", "s consists of only lowercase English letters."],
            functionName: "firstUniqChar"
        },
        { 
            id: "h-8", 
            title: "Isomorphic Strings", 
            difficulty: "Easy", 
            category: "Hashing", 
            description: "Given two strings s and t, determine if they are isomorphic.\n\nTwo strings s and t are isomorphic if the characters in s can be replaced to get t.\n\nAll occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.", 
            examples: [
                { input: "s = 'egg', t = 'add'", output: "true" },
                { input: "s = 'foo', t = 'bar'", output: "false" }
            ], 
            constraints: ["1 <= s.length <= 5 * 10^4", "t.length == s.length", "s and t consist of any valid ascii character."],
            functionName: "isIsomorphic"
        },
        { 
            id: "h-9", 
            title: "Word Pattern", 
            difficulty: "Easy", 
            category: "Hashing", 
            description: "Given a pattern and a string s, find if s follows the same pattern.\n\nHere follow means a full match, such that there is a bijection between a letter in pattern and a non-empty word in s.", 
            examples: [
                { input: "pattern = 'abba', s = 'dog cat cat dog'", output: "true" },
                { input: "pattern = 'abba', s = 'dog cat cat fish'", output: "false" }
            ], 
            constraints: ["1 <= pattern.length <= 300", "pattern consists of lowercase English letters.", "1 <= s.length <= 3000", "s consists of lowercase English letters and spaces ' '.", "s does not contain any leading or trailing spaces.", "All the words in s are separated by a single space."],
            functionName: "wordPattern"
        },
        { 
            id: "h-10", 
            title: "Insert Delete GetRandom O(1)", 
            difficulty: "Medium", 
            category: "Hashing", 
            description: "Implement the RandomizedSet class:\n- RandomizedSet() Initializes the RandomizedSet object.\n- bool insert(int val) Inserts an item val into the set if not present. Returns true if the item was not present, false otherwise.\n- bool remove(int val) Removes an item val from the set if present. Returns true if the item was present, false otherwise.\n- int getRandom() Returns a random element from the current set of elements (it's guaranteed that at least one element exists when this method is called). Each element must have the same probability of being returned.\n\nYou must implement the functions of the class such that each function works in average O(1) time complexity.", 
            examples: [
                { input: "insert(1); remove(2); insert(2); getRandom();", output: "true, false, true, (1 or 2)" }
            ], 
            constraints: ["-2^31 <= val <= 2^31 - 1", "At most 2 * 10^5 calls will be made to insert, remove, and getRandom.", "There will be at least one element in the data structure when getRandom is called."],
            functionName: "RandomizedSet"
        },
    ],
    "Searching & Sorting": [
        { 
            id: "ss-1", 
            title: "Binary Search", 
            difficulty: "Easy", 
            category: "Searching & Sorting", 
            description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.", 
            examples: [
                { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4" }
            ], 
            constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All the integers in nums are unique.", "nums is sorted in ascending order."],
            functionName: "search"
        },
        { 
            id: "ss-2", 
            title: "Search in Rotated Sorted Array", 
            difficulty: "Medium", 
            category: "Searching & Sorting", 
            description: "There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.", 
            examples: [
                { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }
            ], 
            constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values of nums are unique.", "nums is an ascending array that is possibly rotated."],
            functionName: "search"
        },
        { 
            id: "ss-3", 
            title: "First and Last Position of Element", 
            difficulty: "Medium", 
            category: "Searching & Sorting", 
            description: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.\n\nIf target is not found in the array, return [-1, -1].\n\nYou must write an algorithm with O(log n) runtime complexity.", 
            examples: [
                { input: "nums = [5,7,7,8,8,10], target = 8", output: "[3,4]" },
                { input: "nums = [5,7,7,8,8,10], target = 6", output: "[-1,-1]" }
            ], 
            constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9", "nums is a non-decreasing array.", "-10^9 <= target <= 10^9"],
            functionName: "searchRange"
        },
        { 
            id: "ss-4", 
            title: "Find Peak Element", 
            difficulty: "Medium", 
            category: "Searching & Sorting", 
            description: "A peak element is an element that is strictly greater than its neighbors.\n\nGiven an integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.\n\nYou may imagine that nums[-1] = nums[n] = -∞.\n\nYou must write an algorithm that runs in O(log n) time.", 
            examples: [
                { input: "nums = [1,2,3,1]", output: "2", explanation: "3 is a peak element and your function should return the index number 2." }
            ], 
            constraints: ["1 <= nums.length <= 1000", "-2^31 <= nums[i] <= 2^31 - 1", "nums[i] != nums[i + 1] for all valid i."],
            functionName: "findPeakElement"
        },
        { 
            id: "ss-5", 
            title: "Merge Sorted Array", 
            difficulty: "Easy", 
            category: "Searching & Sorting", 
            description: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.\n\nMerge nums1 and nums2 into a single array sorted in non-decreasing order.\n\nThe final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.", 
            examples: [
                { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" }
            ], 
            constraints: ["nums1.length == m + n", "nums2.length == n", "0 <= m, n <= 200", "1 <= m + n <= 200", "-10^9 <= nums1[i], nums2[j] <= 10^9"],
            functionName: "merge"
        },
        { 
            id: "ss-6", 
            title: "Sort Colors (Dutch National Flag)", 
            difficulty: "Medium", 
            category: "Searching & Sorting", 
            description: "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.\n\nYou must solve this problem without using the library's sort function.", 
            examples: [
                { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" }
            ], 
            constraints: ["n == nums.length", "1 <= n <= 300", "nums[i] is either 0, 1, or 2."],
            functionName: "sortColors"
        },
        { 
            id: "ss-7", 
            title: "Find Minimum in Rotated Sorted Array", 
            difficulty: "Medium", 
            category: "Searching & Sorting", 
            description: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:\n\n[4,5,6,7,0,1,2] if it was rotated 4 times.\n[0,1,2,4,5,6,7] if it was rotated 7 times.\n\nNotice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].\n\nGiven the sorted rotated array nums of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in O(log n) time.", 
            examples: [
                { input: "nums = [3,4,5,1,2]", output: "1" }
            ], 
            constraints: ["n == nums.length", "1 <= n <= 5000", "-5000 <= nums[i] <= 5000", "All the integers in nums are unique.", "nums is sorted and rotated between 1 and n times."],
            functionName: "findMin"
        },
        { 
            id: "ss-8", 
            title: "Kth Largest Element in an Array", 
            difficulty: "Medium", 
            category: "Searching & Sorting", 
            description: "Given an integer array nums and an integer k, return the kth largest element in the array.\n\nNote that it is the kth largest element in the sorted order, not the kth distinct element.\n\nYou must solve it in O(n) average time complexity.", 
            examples: [
                { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" }
            ], 
            constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
            functionName: "findKthLargest"
        },
        { 
            id: "ss-9", 
            title: "Median of Two Sorted Arrays", 
            difficulty: "Hard", 
            category: "Searching & Sorting", 
            description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).", 
            examples: [
                { input: "nums1 = [1,3], nums2 = [2]", output: "2.0" },
                { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5", explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5." }
            ], 
            constraints: ["nums1.length == m", "nums2.length == n", "0 <= m <= 1000", "0 <= n <= 1000", "1 <= m + n <= 2000", "-10^6 <= nums1[i], nums2[i] <= 10^6"],
            functionName: "findMedianSortedArrays"
        },
        { 
            id: "ss-10", 
            title: "Search a 2D Matrix", 
            difficulty: "Medium", 
            category: "Searching & Sorting", 
            description: "Write an efficient algorithm that searches for a value target in an m x n integer matrix matrix. This matrix has the following properties:\n- Integers in each row are sorted from left to right.\n- The first integer of each row is greater than the last integer of the previous row.", 
            examples: [
                { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true" }
            ], 
            constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 100", "-10^4 <= matrix[i][j], target <= 10^4"],
            functionName: "searchMatrix"
        },
    ],
    "Trees": [
        { 
            id: "t-1", 
            title: "Maximum Depth of Binary Tree", 
            difficulty: "Easy", 
            category: "Trees", 
            description: "Given the root of a binary tree, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.", 
            examples: [
                { input: "root = [3,9,20,null,null,15,7]", output: "3" }
            ], 
            constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-100 <= Node.val <= 100"], 
            functionName: "maxDepth" 
        },
        { 
            id: "t-2", 
            title: "Validate Binary Search Tree", 
            difficulty: "Medium", 
            category: "Trees", 
            description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys less than the node's key.\n- The right subtree of a node contains only nodes with keys greater than the node's key.\n- Both the left and right subtrees must also be binary search trees.", 
            examples: [
                { input: "root = [2,1,3]", output: "true" },
                { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "The root node's value is 5 but its right child's value is 4." }
            ], 
            constraints: ["The number of nodes in the tree is in the range [1, 10^4].", "-2^31 <= Node.val <= 2^31 - 1"], 
            functionName: "isValidBST" 
        },
        { 
            id: "t-3", 
            title: "Symmetric Tree", 
            difficulty: "Easy", 
            category: "Trees", 
            description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).", 
            examples: [
                { input: "root = [1,2,2,3,4,4,3]", output: "true" }
            ], 
            constraints: ["The number of nodes in the tree is in the range [1, 1000].", "-100 <= Node.val <= 100"], 
            functionName: "isSymmetric" 
        },
        { 
            id: "t-4", 
            title: "Binary Tree Level Order Traversal", 
            difficulty: "Medium", 
            category: "Trees", 
            description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).", 
            examples: [
                { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }
            ], 
            constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"], 
            functionName: "levelOrder" 
        },
        { 
            id: "t-5", 
            title: "Invert Binary Tree", 
            difficulty: "Easy", 
            category: "Trees", 
            description: "Given the root of a binary tree, invert the tree, and return its root.", 
            examples: [
                { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }
            ], 
            constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"], 
            functionName: "invertTree" 
        },
        { 
            id: "t-6", 
            title: "Lowest Common Ancestor (BST)", 
            difficulty: "Easy", 
            category: "Trees", 
            description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.\n\nAccording to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).”", 
            examples: [
                { input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", output: "6" }
            ], 
            constraints: ["The number of nodes in the tree is in the range [2, 10^5].", "-10^9 <= Node.val <= 10^9", "All Node.val are unique.", "p != q.", "p and q will exist in the BST."], 
            functionName: "lowestCommonAncestor" 
        },
        { 
            id: "t-7", 
            title: "Diameter of Binary Tree", 
            difficulty: "Easy", 
            category: "Trees", 
            description: "Given the root of a binary tree, return the length of the diameter of the tree.\n\nThe diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.\n\nThe length of a path between two nodes is represented by the number of edges between them.", 
            examples: [
                { input: "root = [1,2,3,4,5]", output: "3", explanation: "3 is the length of the path [4,2,1,3] or [5,2,1,3]." }
            ], 
            constraints: ["The number of nodes in the tree is in the range [1, 10^4].", "-100 <= Node.val <= 100"], 
            functionName: "diameterOfBinaryTree" 
        },
        { 
            id: "t-8", 
            title: "Path Sum", 
            difficulty: "Easy", 
            category: "Trees", 
            description: "Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.\n\nA leaf is a node with no children.", 
            examples: [
                { input: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22", output: "true" }
            ], 
            constraints: ["The number of nodes in the tree is in the range [0, 5000].", "-1000 <= Node.val <= 1000", "-1000 <= targetSum <= 1000"], 
            functionName: "hasPathSum" 
        },
        { 
            id: "t-9", 
            title: "Binary Tree Zigzag Level Order Traversal", 
            difficulty: "Medium", 
            category: "Trees", 
            description: "Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).", 
            examples: [
                { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]" }
            ], 
            constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-100 <= Node.val <= 100"], 
            functionName: "zigzagLevelOrder" 
        },
        { 
            id: "t-10", 
            title: "Convert Sorted Array to BST", 
            difficulty: "Easy", 
            category: "Trees", 
            description: "Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.", 
            examples: [
                { input: "nums = [-10,-3,0,5,9]", output: "[0,-3,9,-10,null,5]" }
            ], 
            constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums is sorted in a strictly increasing order."], 
            functionName: "sortedArrayToBST" 
        },
    ],
    "Graphs": [
        { 
            id: "g-1", 
            title: "Number of Islands", 
            difficulty: "Medium", 
            category: "Graphs", 
            description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.", 
            examples: [
                { input: "grid = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]", output: "3" }
            ], 
            constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'."],
            functionName: "numIslands"
        },
        { 
            id: "g-2", 
            title: "Clone Graph", 
            difficulty: "Medium", 
            category: "Graphs", 
            description: "Given a reference of a node in a connected undirected graph.\n\nReturn a deep copy (clone) of the graph.\n\nEach node in the graph contains a value (int) and a list (List[Node]) of its neighbors.", 
            examples: [
                { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]" }
            ], 
            constraints: ["The number of nodes in the graph is in the range [0, 100].", "1 <= Node.val <= 100", "Node.val is unique for each node.", "There are no repeated edges and no self-loops in the graph.", "The Graph is connected and all nodes can be visited starting from the given node."],
            functionName: "cloneGraph"
        },
        { 
            id: "g-3", 
            title: "Course Schedule", 
            difficulty: "Medium", 
            category: "Graphs", 
            description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nFor example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.\n\nReturn true if you can finish all courses. Otherwise, return false.", 
            examples: [
                { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "To take course 1 you should have finished course 0. So it is possible." },
                { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false", explanation: "To take course 1 you should have finished course 0, and to take course 0 you should have finished course 1. So it is impossible." }
            ], 
            constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000", "prerequisites[i].length == 2", "0 <= ai, bi < numCourses", "All the pairs prerequisites[i] are unique."],
            functionName: "canFinish"
        },
        { 
            id: "g-4", 
            title: "Rotting Oranges", 
            difficulty: "Medium", 
            category: "Graphs", 
            description: "You are given an m x n grid where each cell can have one of three values:\n- 0 representing an empty cell,\n- 1 representing a fresh orange, or\n- 2 representing a rotten orange.\n\nEvery minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.\n\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.", 
            examples: [
                { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" }
            ], 
            constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 10", "grid[i][j] is 0, 1, or 2."],
            functionName: "orangesRotting"
        },
        { 
            id: "g-5", 
            title: "Network Delay Time", 
            difficulty: "Medium", 
            category: "Graphs", 
            description: "You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = (ui, vi, wi), where ui is the source node, vi is the target node, and wi is the time it takes for a signal to travel from source to target.\n\nWe will send a signal from a given node k. Return the minimum time it takes for all the n nodes to receive the signal. If it is impossible for all the n nodes to receive the signal, return -1.", 
            examples: [
                { input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", output: "2" }
            ], 
            constraints: ["1 <= k <= n <= 100", "1 <= times.length <= 6000", "times[i].length == 3", "1 <= ui, vi <= n", "ui != vi", "0 <= wi <= 100", "All the pairs (ui, vi) are unique."],
            functionName: "networkDelayTime"
        },
        { 
            id: "g-6", 
            title: "Word Ladder", 
            difficulty: "Hard", 
            category: "Graphs", 
            description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:\n- Every adjacent pair of words differs by a single letter.\n- Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.\n- sk == endWord\n\nGiven two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.", 
            examples: [
                { input: "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']", output: "5", explanation: "As one shortest transformation is 'hit' -> 'hot' -> 'dot' -> 'dog' -> 'cog', which is 5 words long." }
            ], 
            constraints: ["1 <= beginWord.length <= 10", "endWord.length == beginWord.length", "1 <= wordList.length <= 5000", "wordList[i].length == beginWord.length", "beginWord, endWord, and wordList[i] consist of lowercase English letters.", "beginWord != endWord", "All the words in wordList are unique."],
            functionName: "ladderLength"
        },
        { 
            id: "g-7", 
            title: "Flood Fill", 
            difficulty: "Easy", 
            category: "Graphs", 
            description: "An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image.\n\nYou are also given three integers sr, sc, and color. You should perform a flood fill on the image starting from the pixel image[sr][sc].\n\nTo perform a flood fill, consider the starting pixel, plus any pixels connected 4-directionally to the starting pixel of the same color as the starting pixel, plus any pixels connected 4-directionally to those pixels (also with the same color), and so on. Replace the color of all of the aforementioned pixels with color.\n\nReturn the modified image after performing the flood fill.", 
            examples: [
                { input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2", output: "[[2,2,2],[2,2,0],[2,0,1]]" }
            ], 
            constraints: ["m == image.length", "n == image[i].length", "1 <= m, n <= 50", "0 <= image[i][j], color < 2^16", "0 <= sr < m", "0 <= sc < n"],
            functionName: "floodFill"
        },
        { 
            id: "g-8", 
            title: "Pacific Atlantic Water Flow", 
            difficulty: "Medium", 
            category: "Graphs", 
            description: "There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.\n\nThe island is partitioned into a grid of square cells. You are given an m x n integer matrix heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c).\n\nThe island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean.\n\nReturn a 2D list of grid coordinates result where result[i] = [ri, ci] means that rain water can flow from cell (ri, ci) to both the Pacific and Atlantic oceans.", 
            examples: [
                { input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" }
            ], 
            constraints: ["m == heights.length", "n == heights[r].length", "1 <= m, n <= 200", "0 <= heights[r][c] <= 10^5"],
            functionName: "pacificAtlantic"
        },
        { 
            id: "g-9", 
            title: "Redundant Connection", 
            difficulty: "Medium", 
            category: "Graphs", 
            description: "In this problem, a tree is an undirected graph that is connected and has no cycles.\n\nYou are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added. The added edge has two different vertices chosen from 1 to n, and was not an edge that already existed. The graph is represented as an array edges of length n where edges[i] = [ui, vi] indicates that there is an edge between nodes ui and vi in the graph.\n\nReturn an edge that can be removed so that the resulting graph is a tree of n nodes. If there are multiple answers, return the answer that occurs last in the input.", 
            examples: [
                { input: "edges = [[1,2],[1,3],[2,3]]", output: "[2,3]" },
                { input: "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", output: "[1,4]" }
            ], 
            constraints: ["n == edges.length", "3 <= n <= 1000", "edges[i].length == 2", "1 <= ui, vi <= n", "ui != vi", "There are no repeated edges.", "The given graph is connected."],
            functionName: "findRedundantConnection"
        },
        { 
            id: "g-10", 
            title: "Cheapest Flights Within K Stops", 
            difficulty: "Medium", 
            category: "Graphs", 
            description: "There are n cities connected by some number of flights. You are given an array flights where flights[i] = [fromi, toi, pricei] indicates that there is a flight from city fromi to city toi with cost pricei.\n\nYou are also given three integers src, dst, and k, return the cheapest price from src to dst with at most k stops. If there is no such route, return -1.", 
            examples: [
                { input: "n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1", output: "700" }
            ], 
            constraints: ["1 <= n <= 100", "0 <= flights.length <= (n * (n - 1) / 2)", "flights[i].length == 3", "0 <= fromi, toi < n", "fromi != toi", "1 <= pricei <= 10^4", "0 <= src, dst, k < n", "src != dst"],
            functionName: "findCheapestPrice"
        },
    ],
    "Greedy Algorithms": [
        { 
            id: "ga-1", 
            title: "Jump Game", 
            difficulty: "Medium", 
            category: "Greedy Algorithms", 
            description: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise.", 
            examples: [
                { input: "nums = [2,3,1,1,4]", output: "true", explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index." },
                { input: "nums = [3,2,1,0,4]", output: "false", explanation: "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index." }
            ], 
            constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
            functionName: "canJump"
        },
        { 
            id: "ga-2", 
            title: "Gas Station", 
            difficulty: "Medium", 
            category: "Greedy Algorithms", 
            description: "There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].\n\nYou have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations.\n\nGiven two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique.", 
            examples: [
                { input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", output: "3" }
            ], 
            constraints: ["n == gas.length == cost.length", "1 <= n <= 10^5", "0 <= gas[i], cost[i] <= 10^4"],
            functionName: "canCompleteCircuit"
        },
        { 
            id: "ga-3", 
            title: "Assign Cookies", 
            difficulty: "Easy", 
            category: "Greedy Algorithms", 
            description: "Assume you are a greedyparent and want to give your children some cookies. But, you should give each child at most one cookie.\n\nEach child i has a greed factor g[i], which is the minimum size of a cookie that the child will be content with; and each cookie j has a size s[j]. If s[j] >= g[i], we can assign the cookie j to the child i, and the child i will be content. Your goal is to maximize the number of your content children and output the maximum number.", 
            examples: [
                { input: "g = [1,2,3], s = [1,1]", output: "1" },
                { input: "g = [1,2], s = [1,2,3]", output: "2" }
            ], 
            constraints: ["1 <= g.length <= 3 * 10^4", "0 <= s.length <= 3 * 10^4", "1 <= g[i], s[j] <= 2^31 - 1"],
            functionName: "findContentChildren"
        },
        { 
            id: "ga-4", 
            title: "Non-overlapping Intervals", 
            difficulty: "Medium", 
            category: "Greedy Algorithms", 
            description: "Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.", 
            examples: [
                { input: "intervals = [[1,2],[2,3],[3,4],[1,3]]", output: "1", explanation: "[1,3] can be removed and the rest of the intervals are non-overlapping." }
            ], 
            constraints: ["1 <= intervals.length <= 10^5", "intervals[i].length == 2", "-5 * 10^4 <= starti < endi <= 5 * 10^4"],
            functionName: "eraseOverlapIntervals"
        },
        { 
            id: "ga-5", 
            title: "Candy", 
            difficulty: "Hard", 
            category: "Greedy Algorithms", 
            description: "There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings.\n\nYou are giving candies to these children subjected to the following requirements:\n- Each child must have at least one candy.\n- Children with a higher rating get more candies than their neighbors.\n\nReturn the minimum number of candies you need to have to distribute the candies to the children.", 
            examples: [
                { input: "ratings = [1,0,2]", output: "5", explanation: "You can allocate to the first, second and third child with 2, 1, 2 candies respectively." }
            ], 
            constraints: ["n == ratings.length", "1 <= n <= 2 * 10^4", "0 <= ratings[i] <= 2 * 10^4"],
            functionName: "candy"
        },
        { 
            id: "ga-6", 
            title: "Lemonade Change", 
            difficulty: "Easy", 
            category: "Greedy Algorithms", 
            description: "At a lemonade stand, each lemonade costs $5. Customers are standing in a queue to buy from you and order one at a time (in the order specified by bills). Each customer will only buy one lemonade and pay with either a $5, $10, or $20 bill. You must provide the correct change to each customer so that the net transaction is that the customer pays $5.\n\nNote that you do not have any change in hand at first.\n\nGiven an integer array bills where bills[i] is the bill the ith customer pays, return true if you can provide every customer with the correct change, or false otherwise.", 
            examples: [
                { input: "bills = [5,5,5,10,20]", output: "true" },
                { input: "bills = [5,5,10,10,20]", output: "false" }
            ], 
            constraints: ["1 <= bills.length <= 10^5", "bills[i] is either 5, 10, or 20."],
            functionName: "lemonadeChange"
        },
        { 
            id: "ga-7", 
            title: "Partition Labels", 
            difficulty: "Medium", 
            category: "Greedy Algorithms", 
            description: "You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part.\n\nNote that the partition is done so that after concatenating all the parts in order, the resultant string should be s.\n\nReturn a list of integers representing the size of these parts.", 
            examples: [
                { input: "s = 'ababcbacadefegdehijhklij'", output: "[9,7,8]", explanation: "The partition is 'ababcbaca', 'defegde', 'hijhklij'. This is a partition so that each letter appears in at most one part." }
            ], 
            constraints: ["1 <= s.length <= 500", "s consists of lowercase English letters."],
            functionName: "partitionLabels"
        },
        { 
            id: "ga-8", 
            title: "Task Scheduler", 
            difficulty: "Medium", 
            category: "Greedy Algorithms", 
            description: "Given a characters array tasks, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.\n\nHowever, there is a non-negative integer n that represents the cooldown period between two same tasks (with the same letter), that is that there must be at least n units of time between any two same tasks.\n\nReturn the least number of units of time that the CPU will take to finish all the given tasks.", 
            examples: [
                { input: "tasks = ['A','A','A','B','B','B'], n = 2", output: "8", explanation: "A -> B -> idle -> A -> B -> idle -> A -> B." }
            ], 
            constraints: ["1 <= tasks.length <= 10^4", "tasks[i] is upper-case English letter.", "0 <= n <= 100"],
            functionName: "leastInterval"
        },
        { 
            id: "ga-9", 
            title: "Boat to Save People", 
            difficulty: "Medium", 
            category: "Greedy Algorithms", 
            description: "You are given an array people where people[i] is the weight of the ith person, and an infinite number of boats where each boat can carry a maximum weight of limit. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most limit.\n\nReturn the minimum number of boats to carry every given person.", 
            examples: [
                { input: "people = [1,2], limit = 3", output: "1" },
                { input: "people = [3,2,2,1], limit = 3", output: "3" }
            ], 
            constraints: ["1 <= people.length <= 5 * 10^4", "1 <= people[i] <= limit <= 3 * 10^4"],
            functionName: "numRescueBoats"
        },
        { 
            id: "ga-10", 
            title: "Fractional Knapsack", 
            difficulty: "Medium", 
            category: "Greedy Algorithms", 
            description: "Given weights and values of N items, we need to put these items in a knapsack of capacity W to get the maximum total value in the knapsack.\n\nIn Fractional Knapsack, we can break items for maximizing the total value of knapsack.", 
            examples: [
                { input: "values = [60,100,120], weights = [10,20,30], capacity = 50", output: "240" }
            ], 
            constraints: ["1 <= n <= 100", "1 <= values[i], weights[i] <= 100", "1 <= capacity <= 1000"],
            functionName: "fractionalKnapsack"
        },
    ],
    "Dynamic Programming (DP)": [
        { 
            id: "dp-1", 
            title: "Climbing Stairs", 
            difficulty: "Easy", 
            category: "Dynamic Programming (DP)", 
            description: "You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?", 
            examples: [
                { input: "n = 2", output: "2", explanation: "1. 1 step + 1 step, 2. 2 steps" },
                { input: "n = 3", output: "3", explanation: "1. 1+1+1, 2. 1+2, 3. 2+1" }
            ], 
            constraints: ["1 <= n <= 45"],
            functionName: "climbStairs"
        },
        { 
            id: "dp-2", 
            title: "Longest Increasing Subsequence", 
            difficulty: "Medium", 
            category: "Dynamic Programming (DP)", 
            description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.\n\nA subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements. For example, [3,6,2,7] is a subsequence of the array [0,3,1,6,2,2,7].", 
            examples: [
                { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "The longest increasing subsequence is [2,3,7,101], therefore the length is 4." }
            ], 
            constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
            functionName: "lengthOfLIS"
        },
        { 
            id: "dp-3", 
            title: "Coin Change", 
            difficulty: "Medium", 
            category: "Dynamic Programming (DP)", 
            description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.", 
            examples: [
                { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" }
            ], 
            constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
            functionName: "coinChange"
        },
        { 
            id: "dp-4", 
            title: "Longest Common Subsequence", 
            difficulty: "Medium", 
            category: "Dynamic Programming (DP)", 
            description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\n\nFor example, 'ace' is a subsequence of 'abcde'.\n\nA common subsequence of two strings is a subsequence that is common to both strings.", 
            examples: [
                { input: "text1 = 'abcde', text2 = 'ace'", output: "3" }
            ], 
            constraints: ["1 <= text1.length, text2.length <= 1000", "text1 and text2 consist of only lowercase English characters."],
            functionName: "longestCommonSubsequence"
        },
        { 
            id: "dp-5", 
            title: "Word Break", 
            difficulty: "Medium", 
            category: "Dynamic Programming (DP)", 
            description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.", 
            examples: [
                { input: "s = 'leetcode', wordDict = ['leet', 'code']", output: "true" }
            ], 
            constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000", "1 <= wordDict[i].length <= 20", "s and wordDict[i] consist of only lowercase English letters.", "All the strings of wordDict are unique."],
            functionName: "wordBreak"
        },
        { 
            id: "dp-6", 
            title: "Maximum Subarray (DP)", 
            difficulty: "Medium", 
            category: "Dynamic Programming (DP)", 
            description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nA subarray is a contiguous part of an array.", 
            examples: [
                { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6." }
            ], 
            constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
            functionName: "maxSubArray"
        },
        { 
            id: "dp-7", 
            title: "House Robber", 
            difficulty: "Medium", 
            category: "Dynamic Programming (DP)", 
            description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.", 
            examples: [
                { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (money = 1) and rob house 3 (money = 3). Total amount = 1 + 3 = 4." }
            ], 
            constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
            functionName: "rob"
        },
        { 
            id: "dp-8", 
            title: "Partition Equal Subset Sum", 
            difficulty: "Medium", 
            category: "Dynamic Programming (DP)", 
            description: "Given an integer array nums, return true if you can partition the array into two subsequences such that the sum of the elements in both subsequences is equal or false otherwise.", 
            examples: [
                { input: "nums = [1,5,11,5]", output: "true", explanation: "The array can be partitioned as [1, 5, 5] and [11]." }
            ], 
            constraints: ["1 <= nums.length <= 200", "1 <= nums[i] <= 100"],
            functionName: "canPartition"
        },
        { 
            id: "dp-9", 
            title: "Edit Distance", 
            difficulty: "Hard", 
            category: "Dynamic Programming (DP)", 
            description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.\n\nYou have the following three operations permitted on a word:\n1. Insert a character\n2. Delete a character\n3. Replace a character", 
            examples: [
                { input: "word1 = 'horse', word2 = 'ros'", output: "3", explanation: "horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e')" }
            ], 
            constraints: ["0 <= word1.length, word2.length <= 500", "word1 and word2 consist of lowercase English letters."],
            functionName: "minDistance"
        },
        { 
            id: "dp-10", 
            title: "Unique Paths", 
            difficulty: "Medium", 
            category: "Dynamic Programming (DP)", 
            description: "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.\n\nGiven the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.", 
            examples: [
                { input: "m = 3, n = 7", output: "28" }
            ], 
            constraints: ["1 <= m, n <= 100"],
            functionName: "uniquePaths"
        },
    ],
    "Advanced Topics": [
        { 
            id: "adv-1", 
            title: "Number of 1 Bits", 
            difficulty: "Easy", 
            category: "Advanced Topics", 
            description: "Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).", 
            examples: [
                { input: "n = 00000000000000000000000000001011", output: "3" }
            ], 
            constraints: ["The input must be a binary string of length 32."],
            functionName: "hammingWeight"
        },
        { 
            id: "adv-2", 
            title: "Counting Bits", 
            difficulty: "Easy", 
            category: "Advanced Topics", 
            description: "Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.", 
            examples: [
                { input: "n = 2", output: "[0,1,1]" },
                { input: "n = 5", output: "[0,1,1,2,1,2]" }
            ], 
            constraints: ["0 <= n <= 10^5"],
            functionName: "countBits"
        },
        { 
            id: "adv-3", 
            title: "Single Number", 
            difficulty: "Easy", 
            category: "Advanced Topics", 
            description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.", 
            examples: [
                { input: "nums = [2,2,1]", output: "1" },
                { input: "nums = [4,1,2,1,2]", output: "4" }
            ], 
            constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4", "Each element in the array appears twice except for one element which appears only once."],
            functionName: "singleNumber"
        },
        { 
            id: "adv-4", 
            title: "Reverse Bits", 
            difficulty: "Easy", 
            category: "Advanced Topics", 
            description: "Reverse bits of a given 32 bits unsigned integer.", 
            examples: [
                { input: "n = 00000010100101000001111010011100", output: "964176192 (00111001011110000010100101000000)" }
            ], 
            constraints: ["The input must be a binary string of length 32."],
            functionName: "reverseBits"
        },
        { 
            id: "adv-5", 
            title: "Implement Trie (Prefix Tree)", 
            difficulty: "Medium", 
            category: "Advanced Topics", 
            description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.\n\nImplement the Trie class:\n- Trie() Initializes the trie object.\n- void insert(String word) Inserts the string word into the trie.\n- boolean search(String word) Returns true if the string word is in the trie (i.e., was inserted before), and false otherwise.\n- boolean startsWith(String prefix) Returns true if there is a previously inserted string word that has the prefix prefix, and false otherwise.", 
            examples: [
                { input: "insert('apple'); search('apple'); search('app'); startsWith('app'); insert('app'); search('app');", output: "void, true, false, true, void, true" }
            ], 
            constraints: ["1 <= word.length, prefix.length <= 2000", "word and prefix consist only of lowercase English letters.", "At most 3 * 10^4 calls in total will be made to insert, search, and startsWith."],
            functionName: "Trie"
        },
        { 
            id: "adv-6", 
            title: "Number of Connected Components", 
            difficulty: "Medium", 
            category: "Advanced Topics", 
            description: "You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph.\n\nReturn the number of connected components in the graph.", 
            examples: [
                { input: "n = 5, edges = [[0,1],[1,2],[3,4]]", output: "2" }
            ], 
            constraints: ["1 <= n <= 2000", "0 <= edges.length <= 5000", "edges[i].length == 2", "0 <= ai, bi < n", "ai != bi", "There are no repeated edges."],
            functionName: "countComponents"
        },
        { 
            id: "adv-7", 
            title: "Graph Valid Tree", 
            difficulty: "Medium", 
            category: "Advanced Topics", 
            description: "You have a graph of n nodes labeled from 0 to n - 1. You are given an integer n and a list of edges where edges[i] = [ai, bi] indicates that there is an undirected edge between nodes ai and bi.\n\nReturn true if the edges of the given graph make up a valid tree, and false otherwise.", 
            examples: [
                { input: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]", output: "true" },
                { input: "n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]", output: "false" }
            ], 
            constraints: ["1 <= n <= 2000", "0 <= edges.length <= 5000", "edges[i].length == 2", "0 <= ai, bi < n", "ai != bi", "There are no repeated edges."],
            functionName: "validTree"
        },
        { 
            id: "adv-8", 
            title: "Kth Largest Element in a Stream", 
            difficulty: "Easy", 
            category: "Advanced Topics", 
            description: "Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.\n\nImplement KthLargest class:\n- KthLargest(int k, int[] nums) Initializes the object with the integer k and the stream of integers nums.\n- int add(int val) Appends the integer val to the stream and returns the element representing the kth largest element in the stream.", 
            examples: [
                { input: "KthLargest(3, [4, 5, 8, 2]); add(3); add(5); add(10); add(9); add(4);", output: "4, 5, 5, 8, 8" }
            ], 
            constraints: ["1 <= k <= 10^4", "0 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "-10^4 <= val <= 10^4", "At most 10^4 calls will be made to add.", "It is guaranteed that there will be at least k elements in the array when you search for the kth element."],
            functionName: "KthLargest"
        },
        { 
            id: "adv-9", 
            title: "Find Median from Data Stream", 
            difficulty: "Hard", 
            category: "Advanced Topics", 
            description: "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.\n\nFor example, for arr = [2,3,4], the median is 3.\nFor example, for arr = [2,3], the median is (2 + 3) / 2 = 2.5.\n\nImplement the MedianFinder class:\n- MedianFinder() initializes the MedianFinder object.\n- void addNum(int num) adds the integer num from the data stream to the data structure.\n- double findMedian() returns the median of all elements so far. Answers within 10^-5 of the actual answer will be accepted.", 
            examples: [
                { input: "addNum(1); addNum(2); findMedian(); addNum(3); findMedian();", output: "void, void, 1.5, void, 2.0" }
            ], 
            constraints: ["-10^5 <= num <= 10^5", "There will be at least one element in the data structure before calling findMedian.", "At most 5 * 10^4 calls will be made to addNum and findMedian."],
            functionName: "MedianFinder"
        },
        { 
            id: "adv-10", 
            title: "Longest Repeating Character Replacement", 
            difficulty: "Medium", 
            category: "Advanced Topics", 
            description: "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times.\n\nReturn the length of the longest substring containing the same letter you can get after performing the above operations.", 
            examples: [
                { input: "s = 'ABAB', k = 2", output: "4", explanation: "Replace the two 'A's with two 'B's or vice-versa." },
                { input: "s = 'AABABBA', k = 1", output: "4", explanation: "Replace the 'A' in the middle with 'B' and form 'AABBBBA'. The substring 'BBBB' has the longest length of 4." }
            ], 
            constraints: ["1 <= s.length <= 10^5", "s consists of only uppercase English letters.", "0 <= k <= s.length"],
            functionName: "characterReplacement"
        },
    ],
};
