import time
import json
import os
from typing import Dict, Any, Optional

class ResourceRegulator:
    """
    Handles logical and regulated use of AI resources within the DANIEL_AI ecosystem.
    Implements 'Mode Ahorro' (Saver Mode) and circuit breakers for budget protection.
    """
    
    def __init__(self, daily_budget_tokens: int = 1_000_000, cost_per_1k_tokens: float = 0.002):
        self.daily_budget_tokens = daily_budget_tokens
        self.cost_per_1k_tokens = cost_per_1k_tokens
        self.usage_file = os.path.join(os.path.dirname(__file__), "resource_usage.json")
        self.load_usage()

    def load_usage(self):
        try:
            if os.path.exists(self.usage_file):
                with open(self.usage_file, 'r') as f:
                    self.usage = json.load(f)
            else:
                self.usage = {"tokens_used": 0, "last_reset": time.strftime("%Y-%m-%d")}
        except Exception:
            self.usage = {"tokens_used": 0, "last_reset": time.strftime("%Y-%m-%d")}

    def save_usage(self):
        with open(self.usage_file, 'w') as f:
            json.dump(self.usage, f)

    def check_reset(self):
        today = time.strftime("%Y-%m-%d")
        if self.usage.get("last_reset") != today:
            self.usage = {"tokens_used": 0, "last_reset": today}
            self.save_usage()

    def can_consume(self, estimated_tokens: int, priority: str = "NORMAL") -> bool:
        self.check_reset()
        
        # Mode Ahorro logic
        limit = self.daily_budget_tokens
        if priority == "LOW":
            limit = self.daily_budget_tokens * 0.5  # Restrict low priority if budget is half-used
        
        if self.usage["tokens_used"] + estimated_tokens > limit:
            return False
        return True

    def record_consumption(self, tokens: int):
        self.usage["tokens_used"] += tokens
        self.save_usage()

    def get_mode(self) -> str:
        self.check_reset()
        if self.usage["tokens_used"] > self.daily_budget_tokens * 0.8:
            return "SAVER_MODE"
        return "PERFORMANCE_MODE"

    def get_status(self) -> Dict[str, Any]:
        return {
            "tokens_used": self.usage["tokens_used"],
            "budget_limit": self.daily_budget_tokens,
            "mode": self.get_mode(),
            "completion_percentage": (self.usage["tokens_used"] / self.daily_budget_tokens) * 100
        }

# Global instance for shared use
regulator = ResourceRegulator()
