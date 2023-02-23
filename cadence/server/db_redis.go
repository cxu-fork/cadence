// db_redis.go
// Rate limit database functions.

package main

import (
	"context"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()
var dbr = RedisClient{}

type RedisClient struct {
	RateLimit *redis.Client
}

func redisInit() {
	dbr.RateLimit = redis.NewClient(&redis.Options{
		Addr:     c.RedisAddress + c.RedisPort,
		Password: "",
		DB:       0,
	})
}

func rateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr
		_, err := dbr.RateLimit.Get(ctx, ip).Result()
		if err != nil {
			if err == redis.Nil {
				// redis.Nil means the IP is not in the database.
				// We create a new entry for the IP which will automatically
				// expire after the configured rate limit time expires.
				dbr.RateLimit.Set(ctx, ip, nil, time.Duration(c.RequestRateLimit)*time.Second)
				next.ServeHTTP(w, r)
			} else {
				w.WriteHeader(http.StatusInternalServerError) // 500 Internal Server Error
				return
			}
		} else {
			w.WriteHeader(http.StatusTooManyRequests) // 429 Too Many Requests
			return
		}
	})
}