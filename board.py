class Board:
    pow6 = [1, 6, 36, 216, 1296, 7776, 46656, 279936, 1679616, 10077696, 60466176, 362797056, 2176782336L, 13060694016L, 78364164096L, 470184984576L, 2821109907456L, 16926659444736L, 101559956668416L, 609359740010496L, 3656158440062976L, 21936950640377856L, 131621703842267136L, 789730223053602816L, 4738381338321616896L, 28430288029929701376L, 170581728179578208256L, 1023490369077469249536L, 6140942214464815497216L, 36845653286788892983296L]
    
    def __init__(self, *args, **kwargs):
        self.num = None
        self.arr = None

        if ('num' in kwargs):
            self.num = kwargs['num']
            self.arr = [0 for i in xrange(30)]
            rem = self.num
            for i in xrange(30):
                self.arr[i] = rem%6
                rem /= 6
            self.arr = tuple(self.arr)
            
        elif ('arr' in kwargs):
            num = 0
            if (len(kwargs['arr']) == 5):
                self.arr = []
                for i in xrange(5):
                    for j in xrange(6):
                        ind = i*6+j
                        self.arr.append(kwargs['arr'][i][j])
                        num += self.arr[ind]*(Board.pow6[ind])
                        
            elif (len(kwargs['arr']) == 30):
                self.arr = tuple(kwargs['arr'])
                for i in xrange(30):
                    num += self.arr[i]*(Board.pow6[i])
                    
            self.num = num

    def at(self, i, j):
        return self.arr[i*6 + j]

    def swap(self, p1, p2):
        newNum = self.num
        x1,y1 = p1
        x2,y2 = p2
        newNum -= self.at(x1,y1)*(Board.pow6[x1*6+y1])
        newNum -= self.at(x2,y2)*(Board.pow6[x2*6+y2])
        newNum += self.at(x1,y1)*(Board.pow6[x2*6+y2])
        newNum += self.at(x2,y2)*(Board.pow6[x1*6+y1])
        return Board(num=newNum)

"""
import time
start = time.time()
x = 6
y = Board(num=x)
z = 0
for i in xrange(100000):
    z = y.swap((0,0),(3,3))
            
print time.time()-start
"""

