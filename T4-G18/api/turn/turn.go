package turn

import (
	"strconv"
	"time"

	"github.com/alarmfox/game-repository/model"
)

type Turn struct {
	ID        int64      `json:"id"`
	IsWinner  bool       `json:"isWinner"` //A16 - AGGIUNTO DA A6
	Order     int	     `json:"order"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	PlayerID  int64      `json:"playerId"`
	RoundID   int64      `json:"roundId"`
	Scores    string     `json:"scores"`				//A16 Considerazione: ci manca isWinner
	StartedAt *time.Time `json:"startedAt"`
	ClosedAt  *time.Time `json:"closedAt"`
	TestClass string     `json:"testClass`				//aggiunto da A6 (A16)
	Robot	  string	 `json:"robot`					//aggiunto da A6 (A16)
	Difficulty string	 `json:"difficulty`				//aggiunto da A6 (A16)
}
type CreateRequest struct {
	RoundId   int64      `json:"roundId"`
	Order     int        `json:"order"`
	Scores    string     `json:"scores"`
	Players   []string   `json:"players"`
	StartedAt *time.Time `json:"startedAt,omitempty"`
	ClosedAt  *time.Time `json:"closedAt,omitempty"`
}
func (CreateRequest) Validate() error {
	return nil
}

type UpdateRequest struct {
	Scores    string     `json:"scores"`				//A16 Considerazione: ci manca isWinner
	IsWinner  bool       `json:"isWinner"`	//A16 - AGGIUNTO DA A6
	StartedAt *time.Time `json:"startedAt,omitempty"`
	ClosedAt  *time.Time `json:"closedAt,omitempty"`
	TestClass string     `json:"testClass`				//aggiunto da A6 (A16)
	Robot	  string	 `json:"robot`					//aggiunto da A6 (A16)
	Difficulty string	 `json:"difficulty`				//aggiunto da A6 (A16)
}

func (UpdateRequest) Validate() error {
	return nil
}

type KeyType int64

func (c KeyType) Parse(s string) (KeyType, error) {
	a, err := strconv.ParseInt(s, 10, 64)
	return KeyType(a), err
}

func (k KeyType) AsInt64() int64 {
	return int64(k)
}

func fromModel(t *model.Turn) Turn {
	return Turn{
		ID:        t.ID,
		IsWinner:  t.IsWinner,		//A16 - AGGIUNTO DA A6
		Order:     t.Order,
		Scores:    t.Scores,				//A16 Considerazione: ci manca isWinner
		CreatedAt: t.CreatedAt,
		UpdatedAt: t.UpdatedAt,
		PlayerID:  t.PlayerID,
		StartedAt: t.StartedAt,
		ClosedAt:  t.ClosedAt,
		RoundID:   t.RoundID,
		TestClass: t.TestClass,				//aggiunto da A6 (A16)
		Robot:	   t.Robot,					//aggiunto da A6 (A16)
		Difficulty: t.Difficulty,			//aggiunto da A6 (A16)
	}
}
