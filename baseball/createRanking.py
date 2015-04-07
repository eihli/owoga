import zerorpc
import urllib2
import datetime
import pandas as pd

class Ranking(object):
  def createCsv(self):
    # The following code imports tools we need.
    # It creates a dataframe (similar to an excel table)
    # We then clean up the column names and assign the stats
    # that we are interested in
    ARR_BATTING_DISPLAY = ['Player Name', 'Team', 'Position',
                           'hrs', 'runs', 'rbi', 'ave', 'sb',
                           'adp', 'score_all_stats', 'score_correlated_stats',
                           'rank_all_stats', 'rank_correlated_stats',
                           'percent_from_corr_stats'];
    ARR_PITCHING_DISPLAY = ['Player Name', 'Team', 'Position',
                            'w', 'k', 'sv', 'era', 'whip',
                            'score']

    #df_batters = pd.read_csv('projections/FantasyPros_2015_Projections_H.csv')
    #df_pitchers = pd.read_csv('projections/FantasyPros_2015_Projections_P.csv')
    df_batters = pd.read_table(urllib2.urlopen('http://www.fantasypros.com/mlb/projections/hitters.php?export=xls'), skiprows=6, sep=r'\t')
    df_pitchers = pd.read_table(urllib2.urlopen('http://www.fantasypros.com/mlb/projections/pitchers.php?export=xls'), skiprows=6, sep=r'\t')

    arr_batting_cols = df_batters.columns.values
    arr_pitching_cols = df_pitchers.columns.values

    for i in range(len(arr_batting_cols)):
        arr_batting_cols[i] = arr_batting_cols[i].strip()
    for i in range(len(arr_pitching_cols)):
        arr_pitching_cols[i] = arr_pitching_cols[i].strip()

    df_batters.columns = arr_batting_cols
    df_pitchers.columns = arr_pitching_cols

    arr_batting_stats = ['runs', 'rbi', 'hrs', 'sb', 'ave']
    arr_pitching_stats = {'all': ['w', 'sv', 'k', 'whip', 'era'],
                          'bowling': ['w', 'sv', 'k'], 'golf': ['whip', 'era']}

    arr_correlated_batting_stats = ['runs', 'rbi', 'hrs'];


    # In[6]:

    # This function compares a player to a dataframe of players.
    # Each cell where the player beats a player in the dataframe
    # is marked as true. Each cell where a player loses to a player in the
    # dataframe is marked as false. We sum all of these cells and get a score.
    # 
    # The score is how many points they earn against the entire field of
    # players.

    def compete_batter(player, df, arr_stats):
        t = player[arr_stats] >= df[arr_stats]
        score = t[arr_stats].sum().sum()
        return score

    def compete_pitcher(player, df, arr_bowling, arr_golf):
        df_bowling = player[arr_bowling] >= df[arr_bowling]
        df_golf = player[arr_golf] <= df[arr_golf]
        score_golf = df_golf.sum().sum()
        score_bowling = df_bowling.sum().sum()
        score = score_golf + score_bowling
        return score


    # ## Correlation
    # 
    # Here we can see which stats are most correlated.
    # It is quite obvious runs, rbi, and hrs are the most correlated.
    # sb is most correlated with ave and rbi, but the correlation is not nearly as strong.
    # 

    # In[7]:

    # ## Ranking
    # The following table is based off 2015 projections from [FantasyPros.com](http://www.fantasypros.com/mlb/projections/hitters.php)
    # 
    # The score on the rightmost side of the table is calculated by having each player compete against each other player
    # for each of the five hitting statistics. Each time the player beats someone else's stat, a point was added
    # to their score.
    # 
    # The table is sorted in order of score.
    # 
    # TODO: 
    # * Create function to allow filtering by position.
    # * Add column with each players 2014 ADP (Need a clean ordered list from you, Craig...)
    # * See if players contracts expiring are taken into account by the FantasyPros projections. If not, take them into account.

    # In[8]:

    df_batters['score_all_stats'] = df_batters.apply(compete_batter, df = df_batters,
                                           arr_stats = arr_batting_stats,
                                           axis=1)
    df_batters['score_correlated_stats'] = df_batters.apply(compete_batter,
                                           df = df_batters,
                                           arr_stats = arr_correlated_batting_stats,
                                           axis = 1)
    df_pitchers['score'] = df_pitchers.apply(compete_pitcher, df = df_pitchers,
                                             arr_bowling = arr_pitching_stats['bowling'],
                                             arr_golf = arr_pitching_stats['golf'],
                                             axis = 1)

    # ## Ranking Batters
    # Below, I store the Average Draft Position of each player in the 'adp'
    # column.
    # 
    # I then rank players by a score taking all batting stats into account and
    # store that rank in 'rank_all_stats'.
    # 
    # I then rank them by only the three most correlated stats ('hrs', 'runs', 'rbi'), and store that rank in 'rank_correlated_stats'.
    # 
    # If a player ranks higher in all stats than in correlated stats, that means they get more points from 'sb' and 'ave' than the average player. If someone ranks higher in correlated stats than all stats, that means they get the majority of their points from 'rbi', 'hrs', and 'runs'.
    # 
    # The best team is one that works together, so you want to pick players that rank higher on correlated stats than all stats.

    # In[9]:

    df_batters['adp'] = df_batters.index.values + 1
    df_batters = df_batters.sort(columns = 'score_all_stats', ascending = False)
    df_batters.index = range(0, len(df_batters.index))
    df_batters['rank_all_stats'] = df_batters.index.values + 1
    df_batters = df_batters.sort(columns = 'score_correlated_stats',
                                 ascending = False)
    df_batters.index = range(0, len(df_batters.index))
    df_batters['rank_correlated_stats'] = df_batters.index.values + 1
    df_batters['percent_from_corr_stats'] = df_batters['score_correlated_stats'] / df_batters['score_all_stats']
    df_batters[ARR_BATTING_DISPLAY].head(50)


    # In[10]:

    df_pitchers = df_pitchers.sort(columns = 'score', ascending = False)
    print df_pitchers.head;

    # In[12]:

    date = datetime.datetime.now().strftime("%Y-%m-%d")
    df_batters[ARR_BATTING_DISPLAY].to_csv('rankings/FanPros_Batters_'+date+'.csv')
    df_pitchers[ARR_PITCHING_DISPLAY].to_csv('rankings/FanPros_Pitchers_'+date+'.csv')
    return "Executed"

    # In[35]:

    # This is an example of how to filter by position.
    # center_fielders = df_batters[df_batters.apply(lambda e: 'CF' in e['Position'].split(','), axis=1)]
    # center_fielders.head()

# if __name__ == '__main__':
#   Ranking().createCsv()

s = zerorpc.Server(Ranking())
s.bind("tcp://0.0.0.0:4242")
s.run()