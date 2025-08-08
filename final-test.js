// Final Comprehensive Test Script for Tech Escape
// Run this in browser console to verify all functionality

console.log("🚀 TECH ESCAPE - FINAL FUNCTIONALITY TEST");
console.log("=========================================");

// Test 1: Game Initialization
function testGameInitialization() {
    console.log("\n1. 🎮 Testing Game Initialization...");
    
    if (window.techEscapeGame) {
        console.log("✅ Game object exists");
        console.log("✅ Game initialized:", window.techEscapeGame.gameInitialized);
        console.log("✅ Riddles loaded:", window.techEscapeGame.riddles.length, "challenges");
        return true;
    } else {
        console.error("❌ Game object not found");
        return false;
    }
}

// Test 2: HTML Elements
function testHTMLElements() {
    console.log("\n2. 🏗️ Testing HTML Elements...");
    
    const requiredElements = [
        'authContainer', 'gameContainer', 'riddleNumber', 'riddleQuestion',
        'riddleAnswer', 'answerForm', 'hintBtn', 'hintsCount', 'progressFill',
        'messageContainer', 'finalClueSection'
    ];
    
    let allFound = true;
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id}: Found`);
        } else {
            console.error(`❌ ${id}: Missing`);
            allFound = false;
        }
    });
    
    return allFound;
}

// Test 3: Authentication Flow
function testAuthFlow() {
    console.log("\n3. 🔐 Testing Authentication Flow...");
    
    if (!window.techEscapeGame) {
        console.error("❌ Game not initialized");
        return false;
    }
    
    // Test demo team creation
    try {
        window.techEscapeGame.createTestTeam();
        console.log("✅ Demo team creation works");
        
        setTimeout(() => {
            const gameVisible = !document.getElementById('gameContainer')?.classList.contains('hidden');
            console.log("✅ Game interface shown:", gameVisible);
        }, 1200);
        
        return true;
    } catch (error) {
        console.error("❌ Auth flow failed:", error);
        return false;
    }
}

// Test 4: Challenge Loading
function testChallengeLoading() {
    console.log("\n4. 📝 Testing Challenge Loading...");
    
    setTimeout(() => {
        const riddleContent = document.getElementById('riddleQuestion');
        if (riddleContent && riddleContent.innerHTML.trim() !== '') {
            console.log("✅ Challenge 1 loaded successfully");
            console.log("✅ Content preview:", riddleContent.innerHTML.substring(0, 100) + "...");
            return true;
        } else {
            console.error("❌ Challenge not loaded");
            return false;
        }
    }, 1500);
}

// Test 5: Interactive Elements
function testInteractiveElements() {
    console.log("\n5. 🎯 Testing Interactive Elements...");
    
    setTimeout(() => {
        // Test grid buttons for Challenge 1
        const gridBtns = document.querySelectorAll('.grid-btn');
        console.log("✅ Grid buttons found:", gridBtns.length);
        
        if (gridBtns.length > 0) {
            // Simulate clicking correct buttons
            gridBtns.forEach(btn => {
                if (btn.classList.contains('correct')) {
                    btn.click();
                    console.log("✅ Clicked correct button:", btn.textContent);
                }
            });
            
            // Check if flag is revealed
            setTimeout(() => {
                const flag = document.getElementById('challenge1Flag');
                if (flag && flag.style.display !== 'none') {
                    console.log("✅ Flag revealed successfully");
                } else {
                    console.log("⚠️ Flag not revealed - check interactive logic");
                }
            }, 500);
        }
    }, 2000);
}

// Test 6: Error Handling
function testErrorHandling() {
    console.log("\n6. ⚠️ Testing Error Handling...");
    
    if (!window.techEscapeGame) {
        console.error("❌ Game not initialized");
        return false;
    }
    
    // Test error message throttling
    console.log("Testing error message throttling...");
    window.techEscapeGame.showMessage("Test error 1", "error");
    window.techEscapeGame.showMessage("Test error 2 (should be throttled)", "error");
    window.techEscapeGame.showMessage("Test error 3 (should be throttled)", "error");
    
    console.log("✅ Error throttling tested (check for single popup)");
    return true;
}

// Test 7: Progress System
function testProgressSystem() {
    console.log("\n7. 📊 Testing Progress System...");
    
    if (!window.techEscapeGame) {
        console.error("❌ Game not initialized");
        return false;
    }
    
    try {
        window.techEscapeGame.updateProgressDisplay();
        const progressFill = document.getElementById('progressFill');
        const progressNodes = document.getElementById('progressNodes');
        
        console.log("✅ Progress bar exists:", !!progressFill);
        console.log("✅ Progress nodes exist:", !!progressNodes);
        console.log("✅ Progress nodes count:", progressNodes?.children.length || 0);
        
        return true;
    } catch (error) {
        console.error("❌ Progress system failed:", error);
        return false;
    }
}

// Test 8: Answer Submission
function testAnswerSubmission() {
    console.log("\n8. 📝 Testing Answer Submission...");
    
    setTimeout(() => {
        const answerInput = document.getElementById('riddleAnswer');
        const answerForm = document.getElementById('answerForm');
        
        if (answerInput && answerForm) {
            // Test wrong answer
            answerInput.value = "wrong_answer";
            answerForm.dispatchEvent(new Event('submit', { bubbles: true }));
            console.log("✅ Wrong answer submission tested");
            
            // Test correct answer
            setTimeout(() => {
                answerInput.value = "IEEE{electrical_engineers_1963}";
                answerForm.dispatchEvent(new Event('submit', { bubbles: true }));
                console.log("✅ Correct answer submission tested");
            }, 2000);
        } else {
            console.error("❌ Answer form elements not found");
        }
    }, 3000);
}

// Master Test Function
function runAllTests() {
    console.log("🧪 RUNNING COMPREHENSIVE TESTS");
    console.log("===============================");
    
    const tests = [
        testGameInitialization,
        testHTMLElements,
        testAuthFlow,
        testChallengeLoading,
        testInteractiveElements,
        testErrorHandling,
        testProgressSystem,
        testAnswerSubmission
    ];
    
    let passed = 0;
    
    tests.forEach((test, index) => {
        try {
            if (test()) {
                passed++;
            }
        } catch (error) {
            console.error(`❌ Test ${index + 1} failed:`, error);
        }
    });
    
    setTimeout(() => {
        console.log("\n🎯 TEST RESULTS");
        console.log("================");
        console.log(`✅ Passed: ${passed}/${tests.length} tests`);
        console.log(`📊 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
        
        if (passed === tests.length) {
            console.log("🎉 ALL TESTS PASSED! Tech Escape is ready! 🎉");
        } else {
            console.log("⚠️ Some tests failed. Check the errors above.");
        }
    }, 10000);
}

// Individual test functions for manual testing
window.testGame = {
    runAll: runAllTests,
    init: testGameInitialization,
    html: testHTMLElements,
    auth: testAuthFlow,
    challenges: testChallengeLoading,
    interactive: testInteractiveElements,
    errors: testErrorHandling,
    progress: testProgressSystem,
    answers: testAnswerSubmission
};

console.log("\n🎮 Test functions available:");
console.log("- testGame.runAll() // Run all tests");
console.log("- testGame.init() // Test initialization");
console.log("- testGame.auth() // Test authentication");
console.log("- testGame.challenges() // Test challenge loading");
console.log("- testGame.interactive() // Test interactive elements");
console.log("- testGame.errors() // Test error handling");

console.log("\n✨ Ready to test! Run testGame.runAll() to start!");
