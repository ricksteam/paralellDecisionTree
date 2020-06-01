library(rpart)

fit <-rpart(Kyphosis ~ Age + Number + Start, method="class", data=kyphosis)
capture.output(print(fit), file="./simple_kyphosis.txt")
fit <-rpart(Species ~ Sepal.Length + Sepal.Width + Petal.Length + Petal.Width, method="class", data=iris)
capture.output(print(fit), file="./simple_iris.txt")

#Force a gross overfit so we get a complex result for testing
fit <-rpart(mpg ~ cyl + disp + hp + drat + wt + qsec + vs + am + gear + carb, data=mtcars, minsplit=5)
capture.output(print(fit), file="./simple_mtcars.txt")